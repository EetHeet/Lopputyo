

export function saveTraining(newTraining) {
    return fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTraining)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving: " + response.statusText);

            return response.json();
        })
}