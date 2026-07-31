export async function emitNotification(userId: string, notification: unknown) {
  try {
    await fetch("http://localhost:4000/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        notification,
      }),
    });
  } catch (error) {
    console.error("Socket notification failed:", error);
  }
}
