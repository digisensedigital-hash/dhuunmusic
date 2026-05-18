import axios
  from 'axios';

// -----------------------------------
// API Base
// -----------------------------------

const API_BASE =
  import.meta.env
    .VITE_API_URL ||
  'http://localhost:9000/api';

// -----------------------------------
// Auth Headers
// -----------------------------------

function getAuthHeaders() {
  const token =
    localStorage.getItem(
      'token'
    );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

// -----------------------------------
// Start Listen Session
// -----------------------------------

export async function
startListenSession(
  trackId
) {
  try {
    const response =
      await axios.post(
        `${API_BASE}/listens/start`,
        {
          trackId,
        },
        getAuthHeaders()
      );

    return (
      response.data || null
    );
  } catch (error) {
    console.error(
      'Failed to start listen session:',
      error
    );

    return null;
  }
}

// -----------------------------------
// Heartbeat
// -----------------------------------

export async function
sendListenHeartbeat({
  sessionId,
}) {
  try {
    await axios.post(
      `${API_BASE}/listens/heartbeat`,
      {
        sessionId,
      },
      getAuthHeaders()
    );
  } catch (error) {
    console.error(
      'Heartbeat failed:',
      error
    );
  }
}

// -----------------------------------
// Complete Session
// -----------------------------------

export async function
completeListenSession({
  sessionId,
}) {
  try {
    await axios.post(
      `${API_BASE}/listens/complete`,
      {
        sessionId,
      },
      getAuthHeaders()
    );
  } catch (error) {
    console.error(
      'Failed to complete session:',
      error
    );
  }
}