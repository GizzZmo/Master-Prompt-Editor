// /src/utils/performance.ts

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface BenchmarkResult {
  id: string;
  testName: string;
  promptId?: string;
  strategy?: string;
  metrics: PerformanceMetric[];
  startTime: string;
  endTime: string;
  duration: number;
  status: 'success' | 'failure' | 'timeout';
  error?: string;
}

export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number; // in seconds
  promptId: string;
  strategy?: string;
  rampUpTime?: number; // in seconds
}

export interface LoadTestResult {
  id: string;
  config: LoadTestConfig;
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
  timeline: PerformanceMetric[];
  startTime: string;
  endTime: string;
}

/**
 * Performance testing utilities for prompt optimization
 */
export class PerformanceTester {
  private metrics: PerformanceMetric[] = [];

  /**
   * Start measuring performance for a specific operation
   */
  startMeasurement(id: string, name: string): () => PerformanceMetric {
    const startTime = performance.now();
    const timestamp = new Date().toISOString();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const metric: PerformanceMetric = {
        id,
        name,
        value: duration,
        unit: 'ms',
        timestamp,
        metadata: {
          startTime,
          endTime
        }
      };

      this.metrics.push(metric);
      return metric;
    };
  }

  /**
   * Measure memory usage
   */
  measureMemory(id: string): PerformanceMetric {
    const memoryInfo = (performance as any).memory;
    const metric: PerformanceMetric = {
      id,
      name: 'Memory Usage',
      value: memoryInfo ? memoryInfo.usedJSHeapSize : 0,
      unit: 'bytes',
      timestamp: new Date().toISOString(),
      metadata: memoryInfo
    };

    this.metrics.push(metric);
    return metric;
  }

  /**
   * Benchmark a function execution
   */
  async benchmark<T>(
    id: string,
    name: string,
    fn: () => Promise<T>,
    iterations: number = 1
  ): Promise<BenchmarkResult> {
    const startTime = new Date().toISOString();
    const metrics: PerformanceMetric[] = [];
    let status: 'success' | 'failure' | 'timeout' = 'success';
    let error: string | undefined;

    try {
      for (let i = 0; i < iterations; i++) {
        const stopMeasurement = this.startMeasurement(`${id}_${i}`, `${name} - Iteration ${i + 1}`);
        await fn();
        const metric = stopMeasurement();
        metrics.push(metric);
      }
    } catch (err) {
      status = 'failure';
      error = err instanceof Error ? err.message : 'Unknown error';
    }

    const endTime = new Date().toISOString();
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();

    return {
      id,
      testName: name,
      metrics,
      startTime,
      endTime,
      duration,
      status,
      error
    };
  }

  /**
   * Run load test simulation
   */
  async loadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    const startTime = new Date().toISOString();
    const timeline: PerformanceMetric[] = [];
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    const responseTimes: number[] = [];

    const testDuration = config.duration * 1000; // Convert to ms
    const rampUpTime = (config.rampUpTime || 0) * 1000;
    const endTime = Date.now() + testDuration;

    // Simulate concurrent users
    const userPromises: Promise<void>[] = [];

    for (let user = 0; user < config.concurrentUsers; user++) {
      const userDelay = (user * rampUpTime) / config.concurrentUsers;
      
      userPromises.push(
        new Promise<void>((resolve) => {
          setTimeout(async () => {
            while (Date.now() < endTime) {
              const requestStart = performance.now();
              totalRequests++;

              try {
                // Simulate API call
                await this.simulateAPICall(config.promptId, config.strategy);
                const responseTime = performance.now() - requestStart;
                responseTimes.push(responseTime);
                successfulRequests++;

                timeline.push({
                  id: `request_${totalRequests}`,
                  name: 'Response Time',
                  value: responseTime,
                  unit: 'ms',
                  timestamp: new Date().toISOString()
                });
              } catch (err) {
                failedRequests++;
              }

              // Wait a bit before next request
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            resolve();
          }, userDelay);
        })
      );
    }

    await Promise.all(userPromises);

    const finalEndTime = new Date().toISOString();
    const actualDuration = new Date(finalEndTime).getTime() - new Date(startTime).getTime();

    return {
      id: `load_test_${Date.now()}`,
      config,
      metrics: {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime: responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
        minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
        maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
        requestsPerSecond: totalRequests / (actualDuration / 1000),
        errorRate: totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0
      },
      timeline,
      startTime,
      endTime: finalEndTime
    };
  }

  /**
   * Simulate an API call for load testing
   */
  private async simulateAPICall(promptId: string, strategy?: string): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 200 + 50; // 50-250ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate occasional failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Simulated API failure');
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Calculate statistics from metrics
   */
  calculateStats(metrics: PerformanceMetric[]): {
    average: number;
    min: number;
    max: number;
    standardDeviation: number;
  } {
    if (metrics.length === 0) {
      return { average: 0, min: 0, max: 0, standardDeviation: 0 };
    }

    const values = metrics.map(m => m.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const variance = values.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return { average, min, max, standardDeviation };
  }
}

// Global performance tester instance
export const performanceTester = new PerformanceTester();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const stopMeasurement = performanceTester.startMeasurement(
        `${target.constructor.name}_${propertyKey}`,
        name
      );

      try {
        const result = await originalMethod.apply(this, args);
        stopMeasurement();
        return result;
      } catch (error) {
        stopMeasurement();
        throw error;
      }
    };

    return descriptor;
  };
}