const ARR_APIS = [
    {
        id: crypto.randomUUID(),
        name: "users",
        methods: [
            {
                id: crypto.randomUUID(),
                type: "GET",
                url: "/api/users",
                response: null,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: "posts",
        methods: [
            {
                id: crypto.randomUUID(),
                type: "GET",
                url: "/api/posts",
                response: null,
            },
            {
                id: crypto.randomUUID(),
                type: "GET",
                url: "/api/posts/1",
                response: null,
            },
        ],
    },
];

async function sendApi(apiName, methodId) {
    const api = ARR_APIS.find((a) => a.name === apiName);
    if (!api) return;

    const method = api.methods.find((m) => m.id === methodId);
    if (!method) return;

    const input = document.querySelector(`[data-input="${method.id}"]`);
    const output = document.querySelector(`[data-response="${method.id}"]`);
    const button = document.querySelector(`[data-send-button="${method.id}"]`);

    if (!input || !output || !button) return;

    button.disabled = true;
    button.textContent = "Loading...";

    const start = performance.now();

    try {
        const options = {
            method: method.type,
            headers: {},
        };

        if (method.type !== "GET" && method.type !== "DELETE") {
            options.headers["Content-Type"] = "application/json";

            if (method.body) {
                options.body = JSON.stringify(method.body);
            }
        }

        const res = await fetch(input.value, options);

        const contentType = res.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        const end = performance.now();

        output.textContent = JSON.stringify(
            {
                status: res.status,
                statusText: res.statusText,
                ok: res.ok,
                time: `${Math.round(end - start)} ms`,
                data,
            },
            null,
            2
        );
    } catch (err) {
        output.textContent = JSON.stringify(
            {
                error: err.message,
            },
            null,
            2
        );
    } finally {
        button.disabled = false;
        button.textContent = "Send";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("articles_apis");

    ARR_APIS.forEach((api) => {
        const article = document.createElement("article");
        article.className = "article_api";

        const title = document.createElement("h2");
        title.className = "text-2xl font-semibold mb-6";
        title.textContent = api.name;

        article.appendChild(title);

        api.methods.forEach((method) => {
            const form = document.createElement("form");
            form.className = "space-y-4 mb-8";

            form.addEventListener("submit", (e) => {
                e.preventDefault();
            });
            form.innerHTML = `
<div
    class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border bg-card text-card-foreground p-5 shadow-sm">

    <div class="flex items-center gap-4 flex-1">

        <span
            class="
                rounded-md
                border
                border-border
                bg-secondary
                text-secondary-foreground
                px-3
                py-1
                text-sm
                font-semibold
                min-w-20
                text-center
            ">
            ${method.type}
        </span>

        <input
            data-input="${method.id}"
            type="text"
            value="${method.url}"
            class="
                w-full
                rounded-md
                border
                border-input
                bg-background
                px-3
                py-2
                text-sm
                text-foreground
                placeholder:text-muted-foreground
                outline-none
                ring-offset-background
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:border-ring
            "
        />

    </div>

    <div class="flex gap-2">

        <button
            data-send-button="${method.id}"
            type="button"
            class="
                inline-flex
                items-center
                justify-center
                rounded-md
                bg-primary
                text-primary-foreground
                px-4
                py-2
                text-sm
                font-medium
                transition-colors
                hover:bg-primary/90
                disabled:pointer-events-none
                disabled:opacity-50
            "
        >
            Send
        </button>

        <button
            type="reset"
            class="
                inline-flex
                items-center
                justify-center
                rounded-md
                border
                border-input
                bg-background
                px-4
                py-2
                text-sm
                font-medium
                transition-colors
                hover:bg-accent
                hover:text-accent-foreground
            "
        >
            Reset
        </button>

    </div>

</div>

${method.body
                    ? `
<div class="space-y-2">

    <label
        class="
            text-sm
            font-medium
            text-foreground
        ">
        Request Body
    </label>

    <textarea
        data-body="${method.id}"
        rows="8"
        class="
            w-full
            rounded-lg
            border
            border-input
            bg-muted
            text-foreground
            p-4
            font-mono
            text-sm
            outline-none
            ring-offset-background
            focus-visible:ring-2
            focus-visible:ring-ring
        "
    >${JSON.stringify(method.body, null, 2)}</textarea>

</div>
`
                    : ""
                }

<div class="space-y-2 py-4">

    <h3
        class="
            text-sm
            font-medium
            text-foreground
        ">
        Response
    </h3>

    <pre
        data-response="${method.id}"
        class="
            min-h-48
            overflow-auto
            rounded-lg
            border
            border-border
            bg-muted
            text-foreground
            p-4
            font-mono
            text-sm
        "
    ></pre>

</div>
`;

            const sendButton = form.querySelector(
                `[data-send-button="${method.id}"]`
            );

            sendButton.addEventListener("click", async () => {
                const bodyInput = form.querySelector(
                    `[data-body="${method.id}"]`
                );

                if (bodyInput) {
                    try {
                        method.body = JSON.parse(bodyInput.value);
                    } catch {
                        alert("Invalid JSON Body");
                        return;
                    }
                }

                await sendApi(api.name, method.id);
            });

            article.appendChild(form);
        });

        container.appendChild(article);
    });
});