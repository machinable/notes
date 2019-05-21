import axios from 'axios';

// NotesClient provides a simple wrapper to the Machinable HTTP interface for the Notes project
class NotesClient {
    projectHost() {
        return "https://notes.machinable.io"
    }

    /* helpers */
    getAuthHeaders(){
        return {"Authorization": "Bearer " + this.getAccessToken()}
    }

    getRefreshToken() {
        return localStorage.getItem("refresh_token")
    }

    getAccessToken() {
        return localStorage.getItem("access_token")
    }

    setAccessToken(token) {
        localStorage.setItem("access_token", token);
    }

    /* MANAGEMENT APIS */
    user() {
        var LOGIN = this.projectHost() + "/sessions";
        var REGISTER = this.projectHost() + "/users/register";
        var REFRESH = this.projectHost() + "/sessions/refresh";
        var DELETE_SESSION = this.projectHost() + "/sessions/{sid}";
        var authHeaders = this.getAuthHeaders();
        var refreshHeaders = {"Authorization": "Bearer " + this.getRefreshToken()}

        return {
            login: function(username, password) {
                var encoded = window.btoa(username + ":" + password);
                var headers = {"Authorization": "Basic " + encoded};
                return axios.post(LOGIN, {}, {headers: headers});
            },

            register: function(username, password) {
                return axios.post(REGISTER, {username: username, password: password});
            },

            saveTokens: function(accessToken, refreshToken, sessionId) {
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("session_id", sessionId);
            },

            refreshToken: function() {
                return axios.post(REFRESH, {}, {headers: refreshHeaders})
            },

            logout: function(success, error) {
                this.deleteCurrentSession(function(){
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("session_id");
                    success();
                }, error);
            },

            deleteCurrentSession: function(success, error) {
                var sid = localStorage.getItem("session_id");
                if (sid) {
                    var headers = authHeaders;
                    var URL = DELETE_SESSION.replace("{sid}", sid)
                    axios.delete(URL, {headers: headers}).then(success).catch(error);
                }
                success();
            }
        }
    }

    notes() {
        var LIST_NOTES = this.projectHost() + "/api/notes?_limit=100&_sort=-_metadata.created";
        var CREATE_NOTE = this.projectHost() + "/api/notes";
        var GET_NOTE = this.projectHost() + "/api/notes/{id}";
        var UPDATE_NOTE = this.projectHost() + "/api/notes/{id}";
        var DELETE_NOTE = this.projectHost() + "/api/notes/{id}";

        return {
            // lists all (limit 100) notes
            list: function(success, error) {
                axios.get(LIST_NOTES, {})
                    .then(success)
                    .catch(error);
            },

            // creates a new note with the give payload
            create: function(data, success, error) {
                axios.post(CREATE_NOTE, data, {})
                    .then(success)
                    .catch(error);
            },

            // updates a note based on id
            update: function(id, data, success, error) {
                axios.put(UPDATE_NOTE.replace("{id}", id), data, {})
                    .then(success)
                    .catch(error);
            },

            // retrieves a single note based on id
            // ... if we wanted to be clever, we really do not need this as we list all notes
            get: function(id, success, error) {
                axios.get(GET_NOTE.replace("{id}", id), {})
                    .then(success)
                    .catch(error);
            },

            // deletes a note based on id
            deleteNote: function(id, success, error) {
                axios.delete(DELETE_NOTE.replace("{id}", id), {})
                    .then(success)
                    .catch(error);
            }
        }
    }
}

export default new NotesClient();