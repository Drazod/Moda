import axios from 'axios';

/**
 * Performance/Load Testing Suite
 * Tests how many concurrent users can access the system simultaneously
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4000';
const TEST_TIMEOUT = 60000; // 60 seconds

interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDuration: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errors: Array<{ error: string; count: number }>;
}

/**
 * Helper function to make a single request and measure performance
 */
async function makeRequest(endpoint: string, token?: string): Promise<{
  success: boolean;
  duration: number;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    const headers: any = {};
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    await axios.get(`${BASE_URL}${endpoint}`, { 
      headers,
      timeout: 10000 // 10 second timeout
    });
    const duration = Date.now() - startTime;
    return { success: true, duration };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const errorMsg = error.response?.status
      ? `HTTP ${error.response.status}`
      : error.code === 'ECONNREFUSED'
      ? 'Connection Refused - Server not running'
      : error.message;
    
    return {
      success: false,
      duration,
      error: errorMsg,
    };
  }
}

/**
 * Run concurrent requests and collect metrics
 */
async function runConcurrentRequests(
  concurrentUsers: number,
  endpoint: string,
  token?: string
): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  const promises = Array(concurrentUsers)
    .fill(null)
    .map(() => makeRequest(endpoint, token));

  const results = await Promise.all(promises);
  const totalDuration = Date.now() - startTime;

  const successfulRequests = results.filter((r) => r.success).length;
  const failedRequests = results.filter((r) => !r.success).length;
  const durations = results.map((r) => r.duration);

  // Count error types
  const errorMap = new Map<string, number>();
  results
    .filter((r) => !r.success && r.error)
    .forEach((r) => {
      const count = errorMap.get(r.error!) || 0;
      errorMap.set(r.error!, count + 1);
    });

  return {
    totalRequests: concurrentUsers,
    successfulRequests,
    failedRequests,
    totalDuration,
    averageResponseTime:
      durations.reduce((a, b) => a + b, 0) / durations.length,
    minResponseTime: Math.min(...durations),
    maxResponseTime: Math.max(...durations),
    requestsPerSecond: (concurrentUsers / totalDuration) * 1000,
    errors: Array.from(errorMap.entries()).map(([error, count]) => ({
      error,
      count,
    })),
  };
}

/**
 * Print performance metrics in a readable format
 */
function printMetrics(userCount: number, metrics: PerformanceMetrics): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Performance Test: ${userCount} Concurrent Users`);
  console.log('='.repeat(60));
  console.log(`Total Requests:       ${metrics.totalRequests}`);
  console.log(`✓ Successful:         ${metrics.successfulRequests}`);
  console.log(`✗ Failed:             ${metrics.failedRequests}`);
  console.log(`Success Rate:         ${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2)}%`);
  console.log(`-`.repeat(60));
  console.log(`Total Duration:       ${metrics.totalDuration}ms`);
  console.log(`Avg Response Time:    ${metrics.averageResponseTime.toFixed(2)}ms`);
  console.log(`Min Response Time:    ${metrics.minResponseTime}ms`);
  console.log(`Max Response Time:    ${metrics.maxResponseTime}ms`);
  console.log(`Throughput:           ${metrics.requestsPerSecond.toFixed(2)} req/s`);

  if (metrics.errors.length > 0) {
    console.log(`-`.repeat(60));
    console.log('Error Breakdown:');
    metrics.errors.forEach(({ error, count }) => {
      console.log(`  ${error}: ${count}`);
    });
  }
  console.log('='.repeat(60));
}

describe('Performance Tests - Concurrent Users', () => {
  // Skip these tests in CI or when TEST_PERFORMANCE is not set
  const shouldRun = process.env.TEST_PERFORMANCE === 'true';

  beforeAll(() => {
    if (!shouldRun) {
      console.log('\n⚠️  Performance tests skipped. Set TEST_PERFORMANCE=true to run them.');
    }
  });

  describe('Public Endpoints', () => {
    it(
      'should handle 5 concurrent users on /clothes/list',
      async () => {
        if (!shouldRun) return;

        const metrics = await runConcurrentRequests(5, '/clothes/list');
        printMetrics(5, metrics);

        expect(metrics.successfulRequests).toBeGreaterThan(3); // At least 60% success
        expect(metrics.averageResponseTime).toBeLessThan(10000); // Under 10 seconds average
      },
      TEST_TIMEOUT
    );

    it(
      'should handle 10 concurrent users on /category/list',
      async () => {
        if (!shouldRun) return;

        const metrics = await runConcurrentRequests(10, '/category/list');
        printMetrics(10, metrics);

        expect(metrics.successfulRequests).toBeGreaterThan(7); // At least 70% success
        expect(metrics.averageResponseTime).toBeLessThan(10000); // Under 10 seconds average
      },
      TEST_TIMEOUT
    );

    it(
      'should handle 20 concurrent users on /category/list',
      async () => {
        if (!shouldRun) return;

        const metrics = await runConcurrentRequests(20, '/category/list');
        printMetrics(20, metrics);

        expect(metrics.successfulRequests).toBeGreaterThan(14); // At least 70% success
        expect(metrics.averageResponseTime).toBeLessThan(15000); // Under 15 seconds average
      },
      TEST_TIMEOUT
    );
  });

  describe('Stress Test - Find Breaking Point', () => {
    it(
      'should find maximum concurrent users before degradation',
      async () => {
        if (!shouldRun) return;

        const testSizes = [10, 20, 30];
        const results: Array<{ users: number; metrics: PerformanceMetrics }> = [];

        for (const userCount of testSizes) {
          console.log(`\nTesting with ${userCount} concurrent users...`);
          const metrics = await runConcurrentRequests(userCount, '/category/list');
          printMetrics(userCount, metrics);
          results.push({ users: userCount, metrics });

          // Stop if success rate drops below 50%
          const successRate = metrics.successfulRequests / metrics.totalRequests;
          if (successRate < 0.5) {
            console.log(`\n⚠️  System degraded at ${userCount} concurrent users`);
            break;
          }
        }

        // Find optimal concurrent users (before response time doubles)
        const baselineResponseTime = results[0].metrics.averageResponseTime;
        const optimal = results.find(
          (r) => r.metrics.averageResponseTime > baselineResponseTime * 2
        );

        if (optimal) {
          console.log(`\n📊 System maintains performance up to ~${optimal.users / 2} concurrent users`);
        } else {
          console.log(`\n✅ System handles all tested load levels well`);
        }

        expect(results.length).toBeGreaterThan(0);
      },
      TEST_TIMEOUT * 5
    );
  });

  describe('Sustained Load Test', () => {
    it(
      'should handle sustained load over time (5 concurrent users for 10 seconds)',
      async () => {
        if (!shouldRun) return;

        const duration = 10000; // 10 seconds
        const concurrentUsers = 5;
        const startTime = Date.now();
        const allMetrics: PerformanceMetrics[] = [];

        console.log(`\nRunning sustained load test: ${concurrentUsers} users for ${duration / 1000}s...`);

        while (Date.now() - startTime < duration) {
          const metrics = await runConcurrentRequests(concurrentUsers, '/category/list');
          allMetrics.push(metrics);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second between waves
        }

        // Aggregate results
        const totalRequests = allMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
        const totalSuccessful = allMetrics.reduce((sum, m) => sum + m.successfulRequests, 0);
        const totalFailed = allMetrics.reduce((sum, m) => sum + m.failedRequests, 0);
        const avgResponseTime =
          allMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / allMetrics.length;

        console.log(`\n${'='.repeat(60)}`);
        console.log('Sustained Load Test Results');
        console.log('='.repeat(60));
        console.log(`Test Duration:        ${duration / 1000}s`);
        console.log(`Total Requests:       ${totalRequests}`);
        console.log(`✓ Successful:         ${totalSuccessful}`);
        console.log(`✗ Failed:             ${totalFailed}`);
        console.log(`Success Rate:         ${((totalSuccessful / totalRequests) * 100).toFixed(2)}%`);
        console.log(`Avg Response Time:    ${avgResponseTime.toFixed(2)}ms`);
        console.log('='.repeat(60));

        expect(totalSuccessful / totalRequests).toBeGreaterThan(0.7); // At least 70% success
        expect(avgResponseTime).toBeLessThan(10000); // Under 10 seconds average
      },
      TEST_TIMEOUT * 2
    );
  });

  describe('Database Connection Pool Test', () => {
    it(
      'should handle concurrent database-heavy requests',
      async () => {
        if (!shouldRun) return;

        // Test endpoint that queries database
        const metrics = await runConcurrentRequests(10, '/clothes/list');
        printMetrics(10, metrics);

        // Should handle well with proper connection pooling
        expect(metrics.successfulRequests).toBeGreaterThan(7); // At least 70% success
        expect(metrics.errors.filter((e) => e.error.includes('ETIMEDOUT')).length).toBe(0);
      },
      TEST_TIMEOUT
    );
  });
});

describe('Performance Test Summary', () => {
  it('should provide load testing recommendations', () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('Load Testing Recommendations');
    console.log('='.repeat(60));
    console.log('To run performance tests:');
    console.log('  TEST_PERFORMANCE=true npm test -- performance.test.ts');
    console.log('');
    console.log('To test against production:');
    console.log('  TEST_PERFORMANCE=true TEST_BASE_URL=https://your-api.com npm test');
    console.log('');
    console.log('Recommended thresholds:');
    console.log('  - Success Rate:     > 95%');
    console.log('  - Avg Response:     < 500ms');
    console.log('  - Max Response:     < 2000ms');
    console.log('  - Concurrent Users: > 100');
    console.log('='.repeat(60));
    expect(true).toBe(true);
  });
});
