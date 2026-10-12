import {
  streamText,
  createDataStreamResponse,
  formatDataStreamPart,
  type Message,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import {
  serverTools,
  executeWebsiteAudit,
  executeScoreLead,
  executeOptimizationFix,
  type AuditWebsiteInput,
  type ScoreLeadInput,
} from '@/lib/tools';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * High-fidelity DataStream Simulator for zero-config evaluation & testing.
 * Runs when ANTHROPIC_API_KEY is not configured or mockMode is enabled.
 * Emits exact AI SDK v4 Data Stream chunks covering all 4 lifecycle states.
 */
async function simulateToolChatStream(
  messages: Message[],
  writer: { write: (chunk: any) => void }
) {
  const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user');
  const userText = latestUserMessage?.content || 'Audit https://flyrank.io';

  const toolCallId = `call_${Math.random().toString(36).substring(2, 9)}`;

  // Determine which tool to run based on user prompt
  const isLeadQuery = /lead|pipeline|qualify|prospect|sales|deal|arr|headcount/i.test(userText);
  const isFixQuery = /confirm|deploy|apply fix|patch|remediate/i.test(userText);
  const isErrorExplicit =
    /invalid-domain-error|error|fail|simulate error|dns-failure|timeout-test/i.test(userText);

  if (isLeadQuery) {
    // 1. Text introduction
    const intro = "I'll evaluate and qualify this enterprise prospect using the `scoreLeadPipeline` tool.\n\n";
    writer.write(formatDataStreamPart('text', intro));
    await new Promise((r) => setTimeout(r, 250));

    // 2. Input streaming (partial-call)
    writer.write(
      formatDataStreamPart('tool_call_streaming_start', {
        toolCallId,
        toolName: 'scoreLeadPipeline',
      })
    );

    const leadArgs: ScoreLeadInput = {
      companyDomain: 'acme-corp.com',
      teamSize: 45,
      trafficTier: 'enterprise',
      budgetRange: 'tier_enterprise',
    };

    // Extract potential domain from prompt
    const domainMatch = userText.match(/([a-zA-Z0-9-]+\.(com|io|co|org|net|ai))/i);
    if (domainMatch) {
      leadArgs.companyDomain = domainMatch[1];
    }

    const argString = JSON.stringify(leadArgs);
    const splitChunks = [
      argString.slice(0, 15),
      argString.slice(15, 35),
      argString.slice(35),
    ];

    for (const chunk of splitChunks) {
      await new Promise((r) => setTimeout(r, 120));
      writer.write(
        formatDataStreamPart('tool_call_delta', {
          toolCallId,
          argsTextDelta: chunk,
        })
      );
    }

    // 3. Input available (call state)
    writer.write(
      formatDataStreamPart('tool_call', {
        toolCallId,
        toolName: 'scoreLeadPipeline',
        args: leadArgs,
      })
    );

    // 4. Server executes tool
    const leadResult = await executeScoreLead(leadArgs);

    // 5. Output available (result)
    writer.write(
      formatDataStreamPart('tool_result', {
        toolCallId,
        result: leadResult,
      })
    );

    // 6. Concluding synthesis
    await new Promise((r) => setTimeout(r, 200));
    const outro =
      '\n\nThe prospect qualification score and pipeline telemetry are rendered above. Based on their traffic volume and team scale, this account qualifies for high-priority executive engagement.';
    writer.write(formatDataStreamPart('text', outro));

    writer.write(
      formatDataStreamPart('finish_message', {
        finishReason: 'stop',
        usage: { promptTokens: 140, completionTokens: 180 },
      })
    );
    return;
  }

  if (isFixQuery) {
    // Human in the loop confirmation demonstration
    const intro = "I've prepared an automated Core Web Vitals optimization patch. Before pushing to production, I'll request your explicit authorization.\n\n";
    writer.write(formatDataStreamPart('text', intro));
    await new Promise((r) => setTimeout(r, 250));

    writer.write(
      formatDataStreamPart('tool_call_streaming_start', {
        toolCallId,
        toolName: 'confirmOptimizationFix',
      })
    );

    const fixArgs = {
      targetUrl: 'https://flyrank.io',
      fixType: 'compress-images' as const,
      summary: 'Automated conversion of 4 unoptimized hero PNGs to responsive WebP with fetchpriority="high"',
      estimatedLcpImpact: 'Reduces LCP from 1.9s to 1.3s (-600ms speedup)',
      requiresDnsChange: false,
    };

    writer.write(
      formatDataStreamPart('tool_call', {
        toolCallId,
        toolName: 'confirmOptimizationFix',
        args: fixArgs,
      })
    );

    const fixResult = await executeOptimizationFix(fixArgs, true);
    writer.write(
      formatDataStreamPart('tool_result', {
        toolCallId,
        result: fixResult,
      })
    );

    const outro = '\n\nThe optimization patch deployment has been processed and logged in telemetry.';
    writer.write(formatDataStreamPart('text', outro));
    writer.write(
      formatDataStreamPart('finish_message', {
        finishReason: 'stop',
        usage: { promptTokens: 110, completionTokens: 90 },
      })
    );
    return;
  }

  // Default: auditWebsite Tool (Primary Core Tool)
  // 1. Text Intro
  const intro = isErrorExplicit
    ? "Executing resilience validation on the requested host. Invoking the `auditWebsite` tool...\n\n"
    : "I'll perform an autonomous technical SEO and Core Web Vitals audit using the `auditWebsite` tool.\n\n";
  writer.write(formatDataStreamPart('text', intro));
  await new Promise((r) => setTimeout(r, 200));

  // 2. Input streaming (partial-call)
  writer.write(
    formatDataStreamPart('tool_call_streaming_start', {
      toolCallId,
      toolName: 'auditWebsite',
    })
  );

  let targetUrl = 'https://flyrank.io';
  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const match = userText.match(urlRegex);
  if (match) {
    targetUrl = match[1];
  } else if (isErrorExplicit) {
    targetUrl = 'https://invalid-domain-error.test';
  }

  const auditArgs: AuditWebsiteInput = {
    url: targetUrl,
    depth: userText.toLowerCase().includes('comprehensive') ? 'comprehensive' : 'quick',
    targetMetric: 'all',
    simulateError: isErrorExplicit,
  };

  // Stream arguments in deltas so user observes input-streaming
  const fullArgsJson = JSON.stringify(auditArgs);
  const chunk1 = fullArgsJson.slice(0, 18);
  const chunk2 = fullArgsJson.slice(18, 42);
  const chunk3 = fullArgsJson.slice(42);

  for (const chunk of [chunk1, chunk2, chunk3]) {
    await new Promise((r) => setTimeout(r, 140));
    writer.write(
      formatDataStreamPart('tool_call_delta', {
        toolCallId,
        argsTextDelta: chunk,
      })
    );
  }

  // 3. Input available (call state)
  writer.write(
    formatDataStreamPart('tool_call', {
      toolCallId,
      toolName: 'auditWebsite',
      args: auditArgs,
    })
  );

  // 4. Server executes tool with real computation & latency
  const auditResult = await executeWebsiteAudit(auditArgs);

  // 5. Output available OR output-error
  writer.write(
    formatDataStreamPart('tool_result', {
      toolCallId,
      result: auditResult,
    })
  );

  // 6. Concluding synthesis
  await new Promise((r) => setTimeout(r, 200));
  const outro =
    'isError' in auditResult
      ? '\n\n⚠️ The tool encountered an unrecoverable network or DNS failure. Review the diagnostic error card above for remediation steps or retry with an active domain.'
      : `\n\n✅ Audit completed successfully. Target property scored **${auditResult.overallScore}/100** with healthy Core Web Vitals. Review the interactive score card and findings table above.`;

  writer.write(formatDataStreamPart('text', outro));
  writer.write(
    formatDataStreamPart('finish_message', {
      finishReason: 'stop',
      usage: { promptTokens: 160, completionTokens: 190 },
    })
  );
}

export async function POST(req: Request) {
  try {
    const { messages, mockMode } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    const useRealAnthropic = Boolean(apiKey && !mockMode);

    if (useRealAnthropic) {
      // Execute live Claude 3.5 Sonnet with serverTools
      const result = streamText({
        model: anthropic('claude-3-5-sonnet-latest'),
        system: `You are FlyRank AI Assistant, an autonomous technical SEO and Web Performance Engineering agent.
Your primary role is to diagnose website health, audit Core Web Vitals, and qualify pipeline leads.
- When the user asks to check, audit, or analyze a website or URL, invoke the 'auditWebsite' tool.
- When the user asks to qualify, score, or evaluate a sales lead or company prospect, invoke the 'scoreLeadPipeline' tool.
- When the user asks to apply or confirm a fix, invoke the 'confirmOptimizationFix' tool.
Always provide a concise, high-value summary of what the tool returned.`,
        messages,
        tools: serverTools,
        maxSteps: 5,
        abortSignal: req.signal,
      });

      return result.toDataStreamResponse();
    }

    // High-fidelity streaming simulator for zero-friction evaluation
    return createDataStreamResponse({
      execute: async (dataStream) => {
        await simulateToolChatStream(messages, dataStream);
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[/api/chat error]:', error.message);

    return new Response(
      JSON.stringify({
        error: 'Tool execution stream failed',
        details: error.message || 'Unknown server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
