

export function saveCustomer(newCustomer) {
    return fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving: " + response.statusText);

            return response.json();
        })
}

export function updateCustomer(url, newCustomer) {
    return fetch(url,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving: " + response.statusText);

            return response.json();
        })
}