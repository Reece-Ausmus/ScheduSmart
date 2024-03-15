// this is used to communicate with flask
// only support for POST function
// example send_route("/get_events", {"calendar_id":"123456789..."})
// this will return the response only

const staticFlaskURL = "http://127.0.0.1:5000";

export default async function send_request(route, message) {
    let flask_URL = staticFlaskURL + route;
    const response = await fetch(flask_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
        credentials: "include"
    })

    const jsonData = await response.json();

    return jsonData;
} 