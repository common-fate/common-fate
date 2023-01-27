import { CloseIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Code,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-location";
import { Column } from "react-table";
import { ProviderIcon } from "../components/icons/providerIcon";
import { UserLayout } from "../components/Layout";
import { TableRenderer } from "../components/tables/TableRenderer";

import { providerKey } from "./setup";
import { Provider, useListAllProviders } from "../utils/registry-client/orval";

/** `${provider.team}/${provider.name}` is the format that will be used for detail lookup on /provider/[id] routes */
export const uniqueProviderKey = (provider: Provider) =>
  encodeURIComponent(`${provider.team}/${provider.name}`);

const Providers = () => {
  const { data: providers } = useListAllProviders();

  return (
    <UserLayout>
      <Helmet>
        <title>Providers</title>
      </Helmet>
      <Container
        my={12}
        // This prevents unbounded widths for small screen widths
        minW={{ base: "100%", lg: "container.lg" }}
        overflowX="auto"
      >
        <Heading>Connect a provider</Heading>
        <SimpleGrid columns={2} spacing={4} p={0} mt={6}>
          {providers?.providers.map((provider) => {
            // providerKey takes three attributes from provider, joins them together and returns a string
            // disassembling this string may be problematic because of the way it is constructed

            // to make a reversable key, we need a way to reconstruct the provider object from the key
            // one possible way is:
            // - use only `name` and `team` for key (version is not needed)
            // - split name and key with a backslash (as is common throughout UI)

            // problems to resolve: there still may be a collision between two providers with the same name and team? (unlikely)
            const id = uniqueProviderKey(provider);

            return (
              <Box
                key={id}
                as="button"
                className="group"
                textAlign="center"
                bg="neutrals.100"
                p={6}
                rounded="md"
                data-testid={"provider_" + id}
                // onClick={() => createProvider(provider)}
                position="relative"
                // disabled={providerLoading !== undefined}
                _disabled={{
                  opacity: "0.5",
                }}
              >
                <LinkOverlay
                  href={`/provider/${id}`}
                  as={Link}
                  to={`/provider/${id}`}
                >
                  {/* {providerLoading === key && (
                    <Spinner size="xs" position="absolute" right={2} top={2} />
                  )} */}
                  <ProviderIcon type={provider.name} mb={3} h="8" w="8" />

                  <Text textStyle="Body/SmallBold" color="neutrals.700">
                    {`${provider.team}/${provider.name}@${provider.version}`}
                  </Text>
                  {/* {provider?.alpha && (
                  <Badge
                    variant="outline"
                    position="absolute"
                    top={4}
                    right={4}
                    colorScheme="gray"
                  >
                    ALPHA
                  </Badge>
                )} */}
                </LinkOverlay>
              </Box>
            );
          })}
        </SimpleGrid>
        {/* <VStack>
          {providers?.providers.map((provider, i) => {
            return (
              <LinkBox key={provider.name + i} as={Flex} w="100%" rounded="md">
                {provider.name}
              </LinkBox>
            );
          })}
        </VStack> */}
        {/*   {setups.length > 0 && (
          <Stack p={1}>
            {setups.map((s) => (
              <ProviderSetupBanner setup={s} key={s.id} />
            ))}
          </Stack>
        )} */}
        {/* <Button
          my={5}
          size="sm"
          variant="ghost"
          leftIcon={<SmallAddIcon />}
          as={Link}
          to="//setup"
          id="new-provider-button"
        >
          New Access Provider
        </Button>
        <AdminProvidersTable />
        <HStack mt={2} spacing={1} w="100%" justify={"center"}>
          <Text textStyle={"Body/ExtraSmall"}>
            View the full configuration of each access provider in your{" "}
          </Text>
          <Code fontSize={"12px"}>deployment.yml</Code>
          <Text textStyle={"Body/ExtraSmall"}>file.</Text>
        </HStack> */}
      </Container>
    </UserLayout>
  );
};

// interface ProviderSetupBannerProps {
//   setup: ProviderSetup;
// }

// const ProviderSetupBanner: React.FC<ProviderSetupBannerProps> = ({ setup }) => {
//   const stepsOverview = setup.steps ?? [];
//   const { data, mutate } = useListProvidersetups();
//   const { onOpen, isOpen, onClose } = useDisclosure();
//   const [loading, setLoading] = useState(false);

//   const handleCancelSetup = async () => {
//     setLoading(true);
//     await deleteProvidersetup(setup.id);
//     const oldSetups = data?.providerSetups ?? [];
//     void mutate({
//       providerSetups: [...oldSetups.filter((s) => s.id !== setup.id)],
//     });
//     setLoading(false);
//     onClose();
//   };

//   const completedSteps = stepsOverview.filter((s) => s.complete).length;

//   const completedPercentage =
//     stepsOverview.length ?? 0 > 0
//       ? (completedSteps / stepsOverview.length) * 100
//       : 0;

//   return (
//     <LinkBox
//       as={Flex}
//       position="relative"
//       justify="space-between"
//       bg="neutrals.100"
//       rounded="md"
//       p={8}
//       flexDirection={{ base: "column", md: "row" }}
//     >
//       <LinkOverlay as={Link} to={"/setup/" + setup.id}>
//         <Stack>
//           <Text textStyle={"Body/Medium"}>
//             Continue setting up {`${setup.team}/${setup.name}@${setup.version}`}
//           </Text>
//           <Text>{/* {setup.type}@{setup.version} */}</Text>
//         </Stack>
//       </LinkOverlay>
//       <HStack spacing={3}>
//         <Text>
//           {completedSteps} of {setup.steps.length} steps complete
//         </Text>
//         <CircularProgress value={completedPercentage} color="#449157" />
//       </HStack>
//       <IconButton
//         position="absolute"
//         top={1}
//         right={1}
//         size="xs"
//         variant={"unstyled"}
//         onClick={(e) => {
//           e.stopPropagation();
//           onOpen();
//         }}
//         icon={<CloseIcon />}
//         aria-label="Cancel setup"
//       />
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Cancel setting up {setup.id}</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             Are you sure you want to stop setting up this provider? You'll lose
//             any configuration values that we've stored.
//           </ModalBody>

//           <ModalFooter>
//             <Button
//               variant={"solid"}
//               colorScheme="red"
//               rounded="full"
//               mr={3}
//               onClick={handleCancelSetup}
//               isLoading={loading}
//             >
//               Stop setup
//             </Button>
//             <Button
//               variant={"brandSecondary"}
//               onClick={onClose}
//               isDisabled={loading}
//             >
//               Go back
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </LinkBox>
//   );
// };

export default Providers;