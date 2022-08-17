import {
  Box,
  Button,
  Center,
  CenterProps,
  Container,
  Flex,
  Grid,
  Link as ChakraLink,
  LinkBox,
  LinkOverlay,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useRef } from "react";
import { Link, MakeGenerics, useNavigate, useSearch } from "react-location";
import { ProviderIcon } from "../../components/icons/providerIcon";
import { UserLayout } from "../../components/Layout";
import AcessRulesMobileModal from "../../components/modals/AcessRulesMobileModal";
import { RequestStatusDisplay } from "../../components/Request";
import {
  useUserListRequestsPast,
  useUserListRequestsUpcoming,
} from "../../utils/backend-client/default/default";
import {
  useListUserAccessRules,
  useUserGetAccessRule,
} from "../../utils/backend-client/end-user/end-user";
import { Request } from "../../utils/backend-client/types";
import { useUser } from "../../utils/context/userContext";
import { renderTiming } from "../../utils/renderTiming";
import { useInfiniteScrollApi } from "../../utils/useInfiniteScrollApi";
import { useIntersection } from "../../utils/useIntersection";

type MyLocationGenerics = MakeGenerics<{
  Search: {
    filter?: "upcoming" | "past";
  };
}>;

const Home: NextPage = () => {
  const search = useSearch<MyLocationGenerics>();
  const navigate = useNavigate<MyLocationGenerics>();

  const { data: rules } = useListUserAccessRules();

  const {
    data: reqsUpcoming,
    isValidating,
    ...upcomingApi
  } = useInfiniteScrollApi<typeof useUserListRequestsUpcoming>({
    swrHook: useUserListRequestsUpcoming,
    hookProps: {},
    listObjKey: "requests",
  });

  const { data: reqsPast, ...pastApi } = useInfiniteScrollApi<
    typeof useUserListRequestsPast
  >({
    swrHook: useUserListRequestsPast,
    hookProps: {},
    listObjKey: "requests",
  });

  const { isOpen, onClose, onToggle } = useDisclosure();

  const user = useUser();

  const upcomingRef = useRef();
  const pastRef = useRef();

  const inViewport = useIntersection(upcomingRef, "90px"); // Trigger if 200px is visible from the element

  useEffect(() => {
    console.log("in view");
    upcomingApi.incrementPage();
    // if (inViewport && !isValidating && upcomingApi.canNextPage) {
    // }
  }, [inViewport]);

  return (
    <>
      <UserLayout>
        <Box overflow="auto">
          <Container maxW="container.xl" pt={{ base: 12, lg: 32 }}>
            <Stack
              direction={["column", "column", "column", "row", "row"]}
              justifyContent="center"
              spacing={12}
            >
              <Box>
                <Flex>
                  <Text
                    as="h3"
                    textStyle="Heading/H3"
                    mt="6px" // this minor adjustment aligns heading with Tabbed content on XL screen widths
                  >
                    New Request
                  </Text>
                  <Button
                    display={{ base: "flex", lg: "none" }}
                    variant="brandSecondary"
                    size="sm"
                    ml="auto"
                    onClick={onToggle}
                  >
                    View All
                  </Button>
                </Flex>
                <Grid
                  mt={8}
                  templateColumns={{
                    base: "repeat(20, 1fr)",
                    lg: "repeat(1, 1fr)",
                    xl: "repeat(2, 1fr)",
                  }}
                  templateRows={{ base: "repeat(1, 1fr)", xl: "unset" }}
                  minW={{ base: "unset", xl: "488px" }}
                  gap={6}
                >
                  {!!rules ? (
                    rules.accessRules.length > 0 ? (
                      rules.accessRules.map((r, i) => (
                        <Link
                          style={{ display: "flex" }}
                          to={"/access/request/" + r.id}
                          key={r.id}
                        >
                          <Box
                            className="group"
                            textAlign="center"
                            bg="neutrals.100"
                            p={6}
                            h="172px"
                            w="232px"
                            rounded="md"
                            data-testid={"r_" + i}
                          >
                            <ProviderIcon
                              provider={r.target.provider}
                              mb={3}
                              h="8"
                              w="8"
                            />

                            <Text
                              textStyle="Body/SmallBold"
                              color="neutrals.700"
                            >
                              {r.name}
                            </Text>

                            <Button
                              mt={4}
                              variant="brandSecondary"
                              size="sm"
                              opacity={0}
                              sx={{
                                // This media query ensure always visible for touch screens
                                "@media (hover: none)": {
                                  opacity: 1,
                                },
                              }}
                              transition="all .2s ease-in-out"
                              transform="translateY(8px)"
                              _groupHover={{
                                bg: "white",
                                opacity: 1,
                                transform: "translateY(0px)",
                              }}
                            >
                              Request
                            </Button>
                          </Box>
                        </Link>
                      ))
                    ) : (
                      <Center
                        bg="neutrals.100"
                        p={6}
                        as="a"
                        h="193px"
                        w="488px"
                        rounded="md"
                        flexDir="column"
                        textAlign="center"
                      >
                        <Text textStyle="Heading/H3" color="neutrals.500">
                          No Access
                        </Text>
                        <Text
                          textStyle="Body/Medium"
                          color="neutrals.400"
                          mt={2}
                        >
                          You don’t have access to anything yet.{" "}
                          {user?.isAdmin ? (
                            <ChakraLink
                              as={Link}
                              to="/admin/access-rules/create"
                              textDecor="none"
                              _hover={{ textDecor: "underline" }}
                            >
                              Click here to create a new access rule.
                            </ChakraLink>
                          ) : (
                            "Ask your Granted administrator to finish setting up Granted."
                          )}
                        </Text>
                      </Center>
                    )
                  ) : (
                    // Otherwise loading state
                    [1, 2, 3, 4].map((i) => (
                      <Skeleton
                        key={i}
                        p={6}
                        h="172px"
                        w="232px"
                        rounded="sm"
                      />
                    ))
                  )}
                </Grid>
              </Box>

              <Tabs
                variant="brand"
                w="100%"
                index={search.filter === "past" ? 1 : 0}
                onChange={(i: any) => {
                  const tab = i === 1 ? "past" : "upcoming";
                  navigate({ search: (old) => ({ ...old, filter: tab }) });
                }}
              >
                <TabList>
                  <Tab>Upcoming</Tab>
                  <Tab>Past</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel overflowY="auto">
                    <Stack spacing={5} maxH="80vh">
                      {reqsUpcoming?.requests?.map((request, i) => (
                        <UserAccessCard
                          type="upcoming"
                          key={request.id + i}
                          req={request}
                          index={i}
                        />
                      ))}
                      {reqsUpcoming === undefined && (
                        <>
                          <Skeleton h="224px" w="100%" rounded="md" />
                          <Skeleton h="224px" w="100%" rounded="md" />
                          <Skeleton h="224px" w="100%" rounded="md" />
                        </>
                      )}
                      {!isValidating && reqsUpcoming?.requests.length === 0 && (
                        <Center
                          bg="neutrals.100"
                          p={6}
                          as="a"
                          h="310px"
                          w="100%"
                          rounded="md"
                          // flexDir="column"
                          // textAlign="center"
                        >
                          <Text textStyle="Heading/H3" color="neutrals.500">
                            No upcoming requests{" "}
                            <Text as="span" opacity={0.5}>
                              ☀️
                            </Text>
                          </Text>
                        </Center>
                      )}
                      <LoadMoreButton
                        // dont apply ref when validating
                        ref={upcomingRef}
                        disabled={!upcomingApi.canNextPage}
                        onClick={upcomingApi.incrementPage}
                      >
                        {isValidating && reqsUpcoming?.requests ? (
                          <Spinner />
                        ) : upcomingApi.canNextPage ? (
                          "Load more"
                        ) : reqsUpcoming?.requests?.length > 4 ? (
                          "That's it!"
                        ) : (
                          ""
                        )}
                      </LoadMoreButton>
                    </Stack>
                  </TabPanel>
                  <TabPanel overflowY="auto">
                    <Stack
                      spacing={5}
                      maxH="80vh"
                      // ref={pastRef}
                      // onScroll={() => handleScroll("past")}
                    >
                      {reqsPast?.requests.map((request, i) => (
                        <UserAccessCard
                          index={i}
                          type="past"
                          key={request.id}
                          req={request}
                        />
                      ))}
                      {reqsPast?.requests === undefined && (
                        <>
                          <Skeleton h="224px" w="100%" rounded="md" />
                          <Skeleton h="224px" w="100%" rounded="md" />
                          <Skeleton h="224px" w="100%" rounded="md" />
                        </>
                      )}
                      {reqsPast?.requests.length === 0 && (
                        <Center
                          bg="neutrals.100"
                          p={6}
                          as="a"
                          h="310px"
                          w="100%"
                          rounded="md"
                        >
                          <Text textStyle="Heading/H3" color="neutrals.500">
                            No past requests{" "}
                            <Text as="span" opacity={0.5}>
                              ☀️
                            </Text>
                          </Text>
                        </Center>
                      )}
                      <LoadMoreButton
                        // dont apply ref when validating
                        ref={isValidating ? null : pastRef}
                        disabled={!pastApi.canNextPage}
                        onClick={pastApi.incrementPage}
                      >
                        {pastApi.isValidating && reqsPast?.requests ? (
                          <Spinner />
                        ) : pastApi.canNextPage ? (
                          "Load more"
                        ) : reqsPast?.requests?.length > 4 ? (
                          "That's it!"
                        ) : (
                          ""
                        )}
                      </LoadMoreButton>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </Container>
        </Box>
        <AcessRulesMobileModal isOpen={isOpen} onClose={onClose} />
      </UserLayout>
    </>
  );
};

export default Home;

const LoadMoreButton = (props: CenterProps) => (
  <Center
    minH={12}
    as="button"
    color="neutrals.500"
    h={10}
    w="100%"
    _hover={{
      _disabled: {
        textDecor: "none",
      },
      textDecor: "underline",
    }}
    {...props}
  />
);
/** things that end users can do to requests */
type RequestOption = "cancel" | "extend" | undefined;

// this is currently a hacky approach, it needs to be fixed once we handle extending requests.
const getRequestOption = (req: Request): RequestOption => {
  if (req.status === "PENDING") return "cancel";
  if (req.status === "APPROVED" && req.timing.startTime) return "cancel";
  if (req.status === "APPROVED") return "extend";
  return undefined;
};

const UserAccessCard: React.FC<
  {
    req: Request;
    type: "upcoming" | "past";
    index: number;
  } & LinkBoxProps
> = ({ req, type, index, ...rest }) => {
  const { data: rule } = useUserGetAccessRule(req?.accessRule?.id);

  const option = getRequestOption(req);

  return (
    <LinkBox {...rest}>
      <Link to={"/requests/" + req.id}>
        <LinkOverlay>
          <Flex
            rounded="md"
            bg="neutrals.100"
            flexDir="column"
            key={req.id}
            pos="relative"
            data-testid={"req_" + req.reason}
          >
            <Stack flexDir="column" p={8} pos="relative" spacing={2}>
              <RequestStatusDisplay request={req} />

              <Flex justify="space-between">
                <Box>
                  {rule ? (
                    <Flex align="center" mr="auto">
                      <ProviderIcon
                        provider={rule?.target.provider}
                        h={10}
                        w={10}
                      />
                      <Text
                        ml={2}
                        textStyle="Body/LargeBold"
                        color="neutrals.700"
                      >
                        {rule?.name}
                      </Text>
                    </Flex>
                  ) : (
                    <Flex align="center" h="40px">
                      <SkeletonCircle h={10} w={10} mr={2} />
                      <SkeletonText noOfLines={1} width="6ch" />
                    </Flex>
                  )}
                  <Text textStyle="Body/Medium" color="neutrals.600" mt={1}>
                    {renderTiming(req.timing)}
                  </Text>
                </Box>
              </Flex>
            </Stack>
          </Flex>
        </LinkOverlay>
      </Link>
    </LinkBox>
  );
};
