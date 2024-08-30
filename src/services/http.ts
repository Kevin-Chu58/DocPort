// import { getToken, isAuthenticated } from './auth';
// import { createError } from './error';

const apiBaseURL = import.meta.env.VITE_API_URL;

type HttpRequestBody =
    | string
    | Blob
    | File
    | ArrayBuffer
    | ArrayBufferView
    | DataView
    | FormData
    | URLSearchParams
    | ReadableStream;

const get = <TResponse>(endpoint: string): Promise<TResponse> =>
    makeRequest(endpoint, "get");

const put = <TResponse>(
    endpoint: string,
    body: Object = "",
    headers = new Headers()
): Promise<TResponse> =>
    makeRequest(
        endpoint,
        "put",
        JSON.stringify(body),
        setContentTypeJSON(headers)
    );

const post = <TResponse>(
    endpoint: string,
    body: Object = "",
    headers = new Headers()
): Promise<TResponse> =>
    makeRequest(
        endpoint,
        "post",
        JSON.stringify(body),
        setContentTypeJSON(headers)
    );

// PATCH is required to be in all caps. http services automatically capitalizes headers for post,put,get,del... but not patch.
const patch = <TResponse>(
    endpoint: string,
    body: Object = "",
    headers = new Headers()
): Promise<TResponse> =>
    makeRequest(
        endpoint,
        "PATCH",
        JSON.stringify(body),
        setContentTypeJSON(headers)
    );

const del = <TResponse>(
    endpoint: string,
    body: Object = "",
    headers = new Headers()
): Promise<TResponse> =>
    makeRequest(
        endpoint,
        "delete",
        JSON.stringify(body),
        setContentTypeJSON(headers)
    );

// make requests to API
const makeRequest = async <TResponse>(
    endpoint: string,
    method: string,
    body?: HttpRequestBody,
    headers?: Headers
): Promise<TResponse> => {
    let response = await fetch(`${apiBaseURL}/api/${endpoint}`, {
        method,
        body,
        headers: headers ?? new Headers()
        //await handleAuthHeader(headers ?? new Headers())
        ,
    });
    return parseResponse(response);
};

const handleAuthHeader = async (headers: Headers): Promise<Headers> => {
    if (true) {
        try {
            const token = "";
            headers.append("Authorization", `Bearer ${token}`);
        } catch (err) {
            throw new Error("Token is not available");
        }
    }
    return headers;
};

// convert Response to JSON
const parseResponse = async <TResponse>(res: Response): Promise<TResponse> => {
    try {
        if (!res.ok) {
            return Promise.reject();
        }

        let json = await res.text();
        let data: TResponse = json.length ? JSON.parse(json) : {};

        return data;
    } catch (err) {
        // Handle error if response body is not valid JSON
        return Promise.reject(err);
    }
};

const setContentTypeJSON = (headers: Headers) => {
    headers.append("Content-Type", "application/json");
    return headers;
};

const setContentTypeText = (headers: Headers) => {
    headers.append("Content-Type", "text/plain");
    return headers;
};

const httpUtils = {
    get,
    put,
    post,
    patch,
    del,
};

export default httpUtils;
