import { MeterProvider, ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'

export class MetricsService {
    private static instance: MetricsService
    private meterProvider: MeterProvider
    private meter: any

    private constructor() {
        this.initializeMetrics()
    }

    public static getInstance(): MetricsService {
        if (!MetricsService.instance) {
            MetricsService.instance = new MetricsService()
        }
        return MetricsService.instance
    }

    private initializeMetrics() {
        const resource = new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'flowise-token-tracking'
        })

        const metricExporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
            ? new OTLPMetricExporter({
                  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
              })
            : new ConsoleMetricExporter()

        this.meterProvider = new MeterProvider({
            resource
        })

        this.meterProvider.addMetricReader(
            new PeriodicExportingMetricReader({
                exporter: metricExporter,
                exportIntervalMillis: 1000
            })
        )

        this.meter = this.meterProvider.getMeter('flowise-token-metrics')
    }

    public recordTokenUsage(data: {
        modelName: string
        promptTokens: number
        completionTokens: number
        totalTokens: number
        cost: number
        userId: string
        chatflowId?: string
        agentflowId?: string
    }) {
        const attributes = {
            model: data.modelName,
            user_id: data.userId,
            chatflow_id: data.chatflowId || 'none',
            agentflow_id: data.agentflowId || 'none'
        }

        // Record prompt tokens
        this.meter.createCounter('llm.prompt_tokens').add(data.promptTokens, attributes)

        // Record completion tokens
        this.meter.createCounter('llm.completion_tokens').add(data.completionTokens, attributes)

        // Record total tokens
        this.meter.createCounter('llm.total_tokens').add(data.totalTokens, attributes)

        // Record cost
        this.meter.createCounter('llm.cost').add(data.cost, attributes)

        // Record request count
        this.meter.createCounter('llm.requests').add(1, attributes)
    }

    public shutdown() {
        return this.meterProvider.shutdown()
    }
} 