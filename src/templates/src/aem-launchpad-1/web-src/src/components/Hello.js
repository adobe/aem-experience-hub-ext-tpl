import { Text } from "@adobe/react-spectrum";
import { extensionId } from "./Constants";

export default function HelloWorld() {
  return (
    <Text>Hello, {"<%= projectName %>"}</Text>
  );
}