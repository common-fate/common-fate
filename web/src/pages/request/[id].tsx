import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Code,
  Container,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { formatDistance, intervalToDuration } from "date-fns";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, MakeGenerics, useMatch } from "react-location";
import { AuditLog } from "../../components/AuditLog";
import { ProviderIcon } from "../../components/icons/providerIcon";
import { UserLayout } from "../../components/Layout";
import { StatusCell } from "../../components/StatusCell";
import {
  useUserGetRequest,
  useUserListRequestAccessGroupGrants,
  useUserListRequestAccessGroups,
} from "../../utils/backend-client/default/default";
import { AccessGroup, Grantv2 } from "../../utils/backend-client/types";
import {
  durationString,
  durationStringHoursMinutes,
} from "../../utils/durationString";

type MyLocationGenerics = MakeGenerics<{
  Search: {
    action?: "approve" | "close";
  };
}>;

const Home = () => {
  const {
    params: { id: requestId },
  } = useMatch();

  const request = useUserGetRequest(requestId, {
    swr: { refreshInterval: 10000 },
    request: {
      baseURL: "http://127.0.0.1:3100",
      headers: {
        Prefer: "code=200, example=example_1",
      },
    },
  });

  const groups = useUserListRequestAccessGroups(requestId, {
    swr: { refreshInterval: 10000 },
    request: {
      baseURL: "http://127.0.0.1:3100",
      headers: {
        Prefer: "code=200, example=ex_1",
      },
    },
  });

  const grants = useUserListRequestAccessGroupGrants("TEST", {
    swr: { refreshInterval: 10000 },
    request: {
      baseURL: "http://127.0.0.1:3100",
      headers: {
        Prefer: "code=200, example=ex_1",
      },
    },
  });

  // const search = useSearch<MyLocationGenerics>();
  // const { action } = search;

  // const [cachedReq, setCachedReq] = useState(data);
  // useEffect(() => {
  //   if (data !== undefined) setCachedReq(data);
  //   return () => {
  //     setCachedReq(undefined);
  //   };
  // }, [data]);

  // const user = useUser();

  return (
    <div>
      <UserLayout>
        <Helmet>
          <title>Access Request</title>
        </Helmet>
        {/* The header bar */}
        <Center borderBottom="1px solid" borderColor="neutrals.200" h="80px">
          <IconButton
            as={Link}
            aria-label="Go back"
            pos="absolute"
            left={4}
            icon={<ArrowBackIcon />}
            rounded="full"
            variant="ghost"
            // to={data?.canReview ? "/reviews?status=pending" : "/requests"}
          />

          <Text as="h4" textStyle="Heading/H4">
            Request details
          </Text>
        </Center>

        {/* Main content */}
        <Container
          maxW={{
            md: "container.lg",
          }}
        >
          <Grid mt={8} gridTemplateColumns={"1fr 240px"} gap="4">
            <GridItem>
              <>
                <Stack spacing={4}>
                  <Flex px={2}>
                    {request.data ? (
                      <Flex>
                        <Avatar
                          size="sm"
                          src={request.data.user.picture}
                          name={
                            request.data.user.firstName +
                            " " +
                            request.data.user.lastName
                          }
                          mr={2}
                        />
                        <Box>
                          <Flex>
                            <Text textStyle="Body/Small">
                              {request.data.user.firstName +
                                " " +
                                request.data.user.lastName}
                            </Text>
                            <Text
                              textStyle="Body/Small"
                              ml={1}
                              color="neutrals.500"
                            >
                              requested at&nbsp;
                              {request.data.createdAt}
                            </Text>
                          </Flex>
                          <Text textStyle="Body/Small" color="neutrals.500">
                            {request.data.user.email}
                          </Text>
                        </Box>
                      </Flex>
                    ) : (
                      <Flex h="42px">
                        <SkeletonCircle size="24px" mr={4} />
                        <Box>
                          <Flex>
                            <SkeletonText
                              noOfLines={1}
                              h="12px"
                              w="12ch"
                              mr="4px"
                            />
                            <SkeletonText noOfLines={1} h="12px" w="12ch" />
                          </Flex>
                          <SkeletonText noOfLines={1} h="12px" w="12ch" />
                        </Box>
                      </Flex>
                    )}
                  </Flex>
                  <Divider borderColor="neutrals.300" w="100%" />

                  <Stack spacing={4}>
                    {groups.data
                      ? groups.data.groups.map((group) => (
                          <AccessGroupItem key={group.id} group={group} />
                        ))
                      : [
                          <Skeleton key={1} rounded="md" h="282px" w="100%" />,
                          <Skeleton key={2} rounded="md" h="82px" w="100%" />,
                          <Skeleton key={3} rounded="md" h="82px" w="100%" />,
                        ]}
                  </Stack>
                </Stack>

                <Code whiteSpace="pre-wrap" mt={32}>
                  {JSON.stringify({ request, groups, grants }, null, 2)}
                </Code>
              </>
            </GridItem>
            <GridItem>
              {/* <h1>audit log</h1> */}
              <AuditLog />
            </GridItem>
          </Grid>
        </Container>
      </UserLayout>
    </div>
  );
};

type NewType = {
  group: AccessGroup;
};

type AccessGroupProps = NewType;

export const HeaderStatusCell = ({ group }: { group: AccessGroup }) => {
  if (group.status === "PENDING") {
    return (
      <Box
        as="span"
        flex="1"
        textAlign="left"
        sx={{
          p: { lineHeight: "120%", textStyle: "Body/Extra Small" },
        }}
      >
        <Text color="neutrals.700">Review Required</Text>
        <Text color="neutrals.500">
          Duration&nbsp;
          {durationString(group.time.maxDurationSeconds)}
        </Text>
      </Box>
    );
  }

  if (group.status === "ACTIVE") {
    return (
      <Flex flex="1">
        <StatusCell
          success="ACTIVE"
          value={group.status}
          replaceValue={
            "Active for the next " +
            durationStringHoursMinutes(
              intervalToDuration({
                start: new Date(),
                end: new Date(),
                // end: new Date(Date.parse(group.grant.end)),
              })
            )
          }
        />
      </Flex>
    );
  }

  return null;
};

export const AccessGroupItem = ({ group }: AccessGroupProps) => {
  const grants = useUserListRequestAccessGroupGrants(group.id, {
    swr: { refreshInterval: 10000 },
    request: {
      baseURL: "http://127.0.0.1:3100",
      headers: {
        Prefer: "code=200, example=ex_1",
      },
    },
  });

  const [selectedGrant, setSelectedGrant] = useState<Grantv2>();
  const grantModalState = useDisclosure();

  const handleGrantClick = (grant: Grantv2) => {
    setSelectedGrant(grant);
    grantModalState.onOpen();
  };
  const handleClose = () => {
    setSelectedGrant(undefined);
    grantModalState.onClose();
  };

  const isReviewer = true;

  return (
    <Box bg="neutrals.100" borderColor="neutrals.300" rounded="lg">
      <Accordion
        key={group.id}
        allowToggle
        // we may want to play with how default index works
        defaultIndex={[0]}
      >
        <AccordionItem border="none">
          <AccordionButton
            p={2}
            bg="neutrals.100"
            roundedTop="md"
            borderBottomColor="neutrals.300"
            borderWidth="1px"
            sx={{
              "&[aria-expanded='false']": {
                roundedBottom: "md",
              },
            }}
          >
            <AccordionIcon boxSize="6" mr={2} />
            <HeaderStatusCell group={group} />
            {isReviewer && (
              <ButtonGroup variant="brandSecondary" spacing={2}>
                <Button
                  size="sm"
                  onClick={() => {
                    console.log("approve");
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    console.log("reject");
                  }}
                >
                  Reject
                </Button>
              </ButtonGroup>
            )}
          </AccordionButton>

          <AccordionPanel
            borderColor="neutrals.300"
            roundedBottom="md"
            borderWidth="1px"
            bg="white"
            p={0}
          >
            <Stack spacing={2} p={2}>
              {grants.data ? (
                grants.data.grants.map((grant) => (
                  <Flex
                    w="100%"
                    borderColor="neutrals.300"
                    rounded="md"
                    borderWidth="1px"
                    bg="white"
                    p={2}
                    pos="relative"
                  >
                    <ProviderIcon boxSize="24px" shortType="aws-sso" mr={2} />
                    <Code bg="white" whiteSpace="pre-wrap">
                      Admin
                      <br />
                      012345678912
                      <br />
                      arn:aws:account::$:account
                      <br />
                      another_misc_field_ 4
                    </Code>
                    {false && (
                      <Spinner
                        thickness="2px"
                        speed="0.65s"
                        emptyColor="neutrals.300"
                        color="neutrals.800"
                        size="sm"
                        top={4}
                        right={4}
                        pos="absolute"
                      />
                    )}
                    <Button
                      variant="brandSecondary"
                      size="xs"
                      top={4}
                      right={4}
                      pos="absolute"
                      onClick={() => handleGrantClick(grant)}
                    >
                      View
                    </Button>
                  </Flex>
                ))
              ) : (
                <Text>loading: todo</Text>
              )}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Modal isOpen={grantModalState.isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textStyle="Body/Small">Access Instructions</Text>

            <Code bg="white" whiteSpace="pre-wrap">
              {JSON.stringify(selectedGrant, null, 2)}
            </Code>
            <Text></Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
