import axios from 'axios';

// NotesClient provides a simple wrapper to the Machinable HTTP interface for the Notes project
class NotesClient {
    projectHost() {
        return "https://notes.machinable.io"
    }

    notes() {
        var LIST_NOTES = this.projectHost() + "/api/notes?_limit=100&_sort=-_metadata.created";
        var CREATE_NOTE = this.projectHost() + "/api/notes";
        var GET_NOTE = this.projectHost() + "/api/notes/{id}";
        var UPDATE_NOTE = this.projectHost() + "/api/notes/{id}";

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
                axios.put(GET_NOTE.replace("{id}", id), {})
                    .then(success)
                    .catch(error);
            }
        }
    }
}

export default new NotesClient();