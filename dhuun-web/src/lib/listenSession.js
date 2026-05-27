import client
  from '../api/client';

// -----------------------------------
// Start Listen Session
// -----------------------------------

export async function
startListenSession(
  trackId
) {

  try {

    const response =

      await client.post(

        '/listens/start',

        {
          trackId,
        }
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

    await client.post(

      '/listens/heartbeat',

      {
        sessionId,
      }
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

    await client.post(

      '/listens/complete',

      {
        sessionId,
      }
    );

  } catch (error) {

    console.error(
      'Failed to complete session:',
      error
    );
  }
}