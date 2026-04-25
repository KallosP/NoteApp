//import {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Login";
import NotesPage from "./NotesPage";
import backendURL from "./Constants/url-constants";

const App = () => {
	const INVALID_TOKEN = "INVALID_TOKEN";
	/*const [token, setToken] = useState(INVALID_TOKEN);*/

	function loginUser(creds) {
		const promise = fetch(`${backendURL}login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(creds)
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
					/*response.json().then((payload) => {
						setToken(payload.token)
						setUserCredId(payload.userCredId);
					});*/
				} else {
					throw "bad creds";
				}
			})
			.catch(() => {
				throw "login failed";
			});

		return promise;
	}

	function addAuthHeader(token, otherHeaders = {}) {
		// FIXME: potential security risk here? never actually
		// intializing token with INVALID_TOKEN, just here for placeholder.
		// token is now coming from NotesPage which is receiving it directly from
		// generateAccessToken in auth.js. Since its directly from the token generation
		// it might not be necessary to have an invalid token check? So no security risk??
		if (token === INVALID_TOKEN) {
			return otherHeaders;
		} else {
			return {
				...otherHeaders,
				Authorization: `Bearer ${token}`
			};
		}
	}

	function signupUser(creds) {
		const promise = fetch(`${backendURL}signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(creds)
		})
			.then((response) => {
				if (response.status === 200) {
					return response.json();
					/*response.json().then((payload) => {
						setToken(payload.token)
					});*/
				} else {
					throw "bad creds";
				}
			})
			.catch(() => {
				throw "signup failed";
			});

		return promise;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login handleSubmit={loginUser} />} />
				<Route path="/signup" element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />} />
				<Route path="/notes" element={<NotesPage addAuthHeader={addAuthHeader} />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
