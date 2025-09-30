const token = "0226c6abd6234d177bc91f2b08574302bdbacfea";

export const apiClient = async (
    url: string,
    options: RequestInit = {},
    useToken: boolean = true
) => {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (useToken && token) {
        headers.set("Authorization", `Token ${token}`);
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    // Якщо статус 204 або body порожній, повертаємо null
    if (res.status === 204 || res.headers.get("Content-Length") === "0") {
        return null;
    }

    return res.json();
};

