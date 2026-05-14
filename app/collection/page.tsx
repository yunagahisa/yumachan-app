export default function CollectionPage() {
  return (
    <div style={styles.container}>
      <h1>Collection</h1>
      <p>ここにユマちゃん一覧（grid）を表示</p>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    paddingBottom: "80px", // ←ナビ被り防止
  },
};