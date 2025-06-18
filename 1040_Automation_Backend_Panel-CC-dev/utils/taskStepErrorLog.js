// utils/taskStepErrorLog.js

/**
 * Tailor error logs for TaskStepErrors with context.
 * @param {Error|string} err - The error object or string
 * @param {Object} context - Optional context (task_uid, file_name, etc.)
 * @returns {{error_message: string, error_code: string}}
 */
function createTaskStepErrorLog(err, context = {}) {
    let error_message = 'Unknown error';
    let error_code = 'UNKNOWN_ERROR';
    if (err) {
        if (err.code) {
            error_code = String(err.code).toUpperCase();
        } else if (err.name) {
            error_code = String(err.name).toUpperCase().replace(/[^A-Z0-9_]/g, '_');
        }
        if (err.message) {
            // Take only the first sentence or up to 120 chars
            error_message = err.message.split(/[.!?\n]/)[0].slice(0, 120);
        } else if (typeof err === 'string') {
            error_message = err.slice(0, 120);
        }
    }
    // Optionally add context info (task_uid, file, etc.)
    if (context.task_uid) {
        error_message = `[Task ${context.task_uid}] ${error_message}`;
    }
    if (context.file_name) {
        error_message = `[File ${context.file_name}] ${error_message}`;
    }
    return { error_message, error_code };
}

module.exports = { createTaskStepErrorLog };
