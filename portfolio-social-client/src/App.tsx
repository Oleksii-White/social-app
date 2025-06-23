import { Button } from "@heroui/button";

export default function App() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Button color="default" radius="none">Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">123</Button>
    </div>
  );
}