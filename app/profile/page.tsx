export default function ProfilePage() {
  return (
    <div style={styles.container}>
      <h1>プロフィール</h1>
      <p>ここにユーザー情報やコレクションが入る予定</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
};