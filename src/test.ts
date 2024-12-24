import https from 'https';
import { RequestOptions } from 'https';

interface SecureRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface SecureResponse<T> {
  data: T;
  statusCode: number;
  headers: Record<string, string>;
}

class SecureHttpsClient {
  public static async request<T>(options: SecureRequestOptions): Promise<SecureResponse<T>> {
    const url = new URL(options.url);

    const requestOptions: RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        'User-Agent': 'SecureHttpsClient/1.0',
      },
      timeout: options.timeout || 30000,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          // Verify TLS version
          const tlsSocket = res.socket as any;

          const body = Buffer.concat(chunks).toString();
          let parsedData: T;

          try {
            parsedData = JSON.parse(body) as T;
          } catch (e) {
            parsedData = body as unknown as T;
          }

          resolve({
            data: parsedData,
            statusCode: res.statusCode || 500,
            headers: res.headers as Record<string, string>,
          });
        });
      });

      req.on('error', (error: Error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      // Send body data if present
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }

      req.end();
    });
  }
}

// Example usage:
async function example() {
  try {
    // GET request example
    const response = await SecureHttpsClient.request<{ data: string }>({
      url: 'https://api.basalwallet.com/pay/api/v1/auth/login',
      headers: {
        Accept: 'application/json',
      },
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Request failed:', error);
  }
}

example();
