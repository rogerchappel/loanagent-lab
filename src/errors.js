export class LabError extends Error { constructor(message, details = {}) { super(message); this.name = 'LabError'; this.details = details; } }
export class ValidationError extends LabError { constructor(message, details = {}) { super(message, details); this.name = 'ValidationError'; } }
