import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import metadata from '../../../../app-metadata.json';
import { extensionId } from "./Constants";

function ExtensionRegistration() {
  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      metadata,
      methods: {
        dashboard: {
          getWidget() {
            return {
                id: extensionId,
                title: '<%= projectName %>',
                description: 'This is <%= projectName %>',
                url: '/index.html#/<%= projectName %>'
              };
          },
        },
      },
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>
}

export default ExtensionRegistration;