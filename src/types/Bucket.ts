export default interface Bucket {
  id: string;
  status: "sharing" | "done";
  name: string;
  files: Array<{ url: string; name: string }>;
}
