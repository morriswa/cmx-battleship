import { Injectable, signal, WritableSignal } from "@angular/core"; // Import necessary Angular utilities

@Injectable() // Marks this class as injectable in Angular's dependency injection system
export class SessionAuthenticationService {
  // WritableSignal to store and manage the session ID
  private sessionId: WritableSignal<string | undefined>;

  // Getter to retrieve the current session ID
  get id() {
    return this.sessionId(); // Returns the current session ID from the signal
  };

  // Getter to check if a session is active (i.e., if a session ID exists)
  get active(): boolean {
    return !!this.sessionId(); // Returns true if session ID exists, otherwise false
  }

  // Constructor initializes the service by checking if there's a session ID stored in localStorage
  constructor() {
    const cachedId = localStorage.getItem("session-service.sessionId"); // Retrieve session ID from localStorage
    this.sessionId = signal(cachedId ?? undefined); // Initialize the sessionId signal with the stored value or undefined
  }

  /**
   * Starts a new session by setting the session ID.
   * @param sessionId The new session ID to store
   */
  start(sessionId: string) {
    this.sessionId.set(sessionId); // Update the session ID in the signal
    localStorage.setItem("session-service.sessionId", sessionId); // Store the session ID in localStorage for persistence
  }

  /**
   * Ends the current session by clearing the session ID.
   */
  end() {
    this.sessionId.set(undefined); // Clear the session ID in the signal
    localStorage.removeItem("session-service.sessionId"); // Remove the session ID from localStorage
  }
}

