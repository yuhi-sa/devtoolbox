export interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: string;
}

export const HTTP_STATUS_CODES: HttpStatus[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx Informational" },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed.", category: "1xx Informational" },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "1xx Informational" },
  // 2xx Success
  { code: 200, name: "OK", description: "The request has succeeded.", category: "2xx Success" },
  { code: 201, name: "Created", description: "The request has been fulfilled and has resulted in a new resource being created.", category: "2xx Success" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "2xx Success" },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content.", category: "2xx Success" },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "2xx Success" },
  // 3xx Redirection
  { code: 301, name: "Moved Permanently", description: "The resource has been permanently moved to a new URL.", category: "3xx Redirection" },
  { code: 302, name: "Found", description: "The resource resides temporarily under a different URL.", category: "3xx Redirection" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the version specified by the request headers.", category: "3xx Redirection" },
  { code: 307, name: "Temporary Redirect", description: "The request should be repeated with another URL, but future requests should use the original URL.", category: "3xx Redirection" },
  { code: 308, name: "Permanent Redirect", description: "The request and all future requests should be repeated using another URL.", category: "3xx Redirection" },
  // 4xx Client Error
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to a client error.", category: "4xx Client Error" },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not been provided.", category: "4xx Client Error" },
  { code: 403, name: "Forbidden", description: "The client does not have access rights to the content.", category: "4xx Client Error" },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource.", category: "4xx Client Error" },
  { code: 405, name: "Method Not Allowed", description: "The request method is not supported for the requested resource.", category: "4xx Client Error" },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", category: "4xx Client Error" },
  { code: 409, name: "Conflict", description: "The request could not be processed because of conflict in the current state of the resource.", category: "4xx Client Error" },
  { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "4xx Client Error" },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server.", category: "4xx Client Error" },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "4xx Client Error" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", category: "4xx Client Error" },
  // 5xx Server Error
  { code: 500, name: "Internal Server Error", description: "The server has encountered a situation it does not know how to handle.", category: "5xx Server Error" },
  { code: 501, name: "Not Implemented", description: "The request method is not supported by the server and cannot be handled.", category: "5xx Server Error" },
  { code: 502, name: "Bad Gateway", description: "The server received an invalid response from the upstream server.", category: "5xx Server Error" },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request.", category: "5xx Server Error" },
  { code: 504, name: "Gateway Timeout", description: "The server is acting as a gateway and cannot get a response in time.", category: "5xx Server Error" },
];

export function searchStatusCodes(query: string): HttpStatus[] {
  if (!query.trim()) return HTTP_STATUS_CODES;

  const q = query.toLowerCase().trim();
  return HTTP_STATUS_CODES.filter(
    (s) =>
      s.code.toString().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );
}

export function getStatusByCode(code: number): HttpStatus | undefined {
  return HTTP_STATUS_CODES.find((s) => s.code === code);
}
