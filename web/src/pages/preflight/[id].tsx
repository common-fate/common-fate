import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Textarea,
  chakra,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Link, useMatch, useNavigate } from "react-location";
import { ProviderIcon, ShortTypes } from "../../components/icons/providerIcon";

import { UserLayout } from "../../components/Layout";
import { TargetDetail } from "../../components/Target";
import {
  useUserGetPreflight,
  userPostRequests,
} from "../../utils/backend-client/default/default";
import {
  CreateAccessRequestGroupOptions,
  CreateAccessRequestRequestBody,
  PreflightAccessGroup,
  RequestAccessGroup,
} from "../../utils/backend-client/types";
import { useState } from "react";
import {
  DurationInput,
  Weeks,
  Days,
  Hours,
  Minutes,
} from "../../components/DurationInput";
import {
  userReviewRequest,
  userRevokeRequest,
} from "../../utils/backend-client/end-user/end-user";
import { durationString } from "../../utils/durationString";

const Home = () => {
  const {
    params: { id: preflightId },
  } = useMatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: preflight, ...network } = useUserGetPreflight(preflightId);

  const methods = useForm<CreateAccessRequestRequestBody>({
    defaultValues: {
      preflightId: preflightId,
    },
  });
  const onSubmit = async (data: CreateAccessRequestRequestBody) => {
    console.debug("submit form data", { data });

    try {
      const request = await userPostRequests(data);
      navigate({ to: `/requests/${request.id}` });
    } catch (err) {
      let description: string | undefined;
      if (axios.isAxiosError(err)) {
        // @ts-ignore
        description = err?.response?.data.error;
      }
      toast({
        title: "Error submitting request",
        description,
        status: "error",
        variant: "subtle",
        duration: 2200,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <UserLayout>
        <Helmet>
          <title>Preflight</title>
        </Helmet>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Center pt={{ base: 12, lg: 32 }}>
              <Stack
                maxW={{
                  base: "100%",
                  md: "container.md",
                }}
                p={12}
                rounded="md"
                spacing={7}
                background="neutrals.100"
                w="100%"
              >
                <Breadcrumb>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/requests">
                      New Request
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Review</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Stack spacing={2} w="100%">
                  {preflight ? (
                    preflight?.accessGroups.map((group, i) => {
                      return (
                        <FormControl
                          isInvalid={
                            !!methods.formState.errors?.groupOptions?.[i]
                          }
                        >
                          <Controller
                            control={methods.control}
                            name={`groupOptions.${i}`}
                            // sets the field up with default value of max request duration
                            defaultValue={{
                              id: group.id,
                              timing: {
                                durationSeconds:
                                  group.timeConstraints.defaultDurationSeconds,
                              },
                            }}
                            render={({
                              field: { onChange, ref, value, onBlur },
                            }) => {
                              return (
                                <Flex
                                  p={2}
                                  w="100%"
                                  borderColor="neutrals.300"
                                  borderWidth="1px"
                                  rounded="lg"
                                  dir="row"
                                >
                                  {/* <HeaderStatusCell group={group} /> */}
                                  <Stack spacing={2} w="100%">
                                    <Flex
                                      justify="space-between"
                                      direction="row"
                                      w="100%"
                                    >
                                      <Text>
                                        {group.requiresApproval
                                          ? "Requires Approval"
                                          : "No Approval Required"}
                                      </Text>

                                      <EditDuration
                                        group={group}
                                        durationSeconds={
                                          value?.timing?.durationSeconds
                                        }
                                        setDurationSeconds={(val) => {
                                          onChange({
                                            id: group.id,
                                            timing: {
                                              durationSeconds: val,
                                            },
                                          });
                                        }}
                                      />
                                    </Flex>
                                    {group.targets.map((target) => {
                                      return (
                                        <Flex
                                          p={2}
                                          borderColor="neutrals.300"
                                          borderWidth="1px"
                                          rounded="lg"
                                          flexDir="row"
                                          background="white"
                                        >
                                          <TargetDetail
                                            showIcon
                                            target={target}
                                          />
                                        </Flex>
                                      );
                                    })}
                                  </Stack>
                                  {methods.formState.errors?.reason
                                    ?.message && (
                                    <FormErrorMessage>
                                      {methods.formState.errors.reason?.message?.toString()}
                                    </FormErrorMessage>
                                  )}
                                </Flex>
                              );
                            }}
                          />
                        </FormControl>
                      );
                    })
                  ) : network.isValidating ? (
                    <Skeleton rounded="lg" h="100px" />
                  ) : (
                    <Center
                      borderColor="neutrals.300"
                      borderWidth="1px"
                      rounded="lg"
                      h="100px"
                      w="100%"
                      p={2}
                    >
                      <Text textStyle="Body/Medium">
                        Preflight request failed.
                        <br />
                        Please contact your administrator
                      </Text>
                    </Center>
                  )}
                </Stack>

                <FormControl isInvalid={!!methods.formState.errors.reason}>
                  <FormLabel htmlFor="reason">
                    <Text textStyle={"Body/Medium"}>
                      Why do you need access?
                    </Text>
                  </FormLabel>
                  <Textarea
                    placeholder="Deploying initial Terraform infrastructure..."
                    bg="neutrals.0"
                    {...methods.register("reason")}
                    onBlur={() => void methods.trigger("reason")}
                  />
                  {methods.formState.errors?.reason?.message && (
                    <FormErrorMessage>
                      {methods.formState.errors.reason?.message?.toString()}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {/* buttons */}
                <Flex w="100%" mt={4}>
                  <Button
                    type="button"
                    isDisabled={methods.formState.isSubmitting}
                    variant="brandSecondary"
                    leftIcon={<ArrowBackIcon />}
                    to="/requests"
                    as={Link}
                  >
                    Go back
                  </Button>
                  <Button
                    type="submit"
                    ml="auto"
                    isDisabled={
                      methods.formState.isValidating ||
                      !methods.formState.isValid
                    }
                    isLoading={methods.formState.isSubmitting}
                    loadingText="Processing request..."
                  >
                    Next (⌘+Enter)
                  </Button>
                </Flex>
              </Stack>
            </Center>
          </form>
        </FormProvider>
      </UserLayout>
    </div>
  );
};

// @TODO: sort out state for props.........
type EditDurationProps = {
  group: PreflightAccessGroup;
  durationSeconds: number;
  setDurationSeconds: React.Dispatch<React.SetStateAction<number>>;
};

export const EditDuration = ({
  group,
  durationSeconds,
  setDurationSeconds,
}: EditDurationProps) => {
  const handleClickMax = () => {
    console.log("setting max state", durationSeconds);
    setDurationSeconds(group.timeConstraints.maxDurationSeconds);
    console.log("setting max state", durationSeconds);
  };

  // durationSeconds state

  const [isEditing, setIsEditing] = useBoolean();

  return (
    <Flex
      align="flex-end"
      justify="flex-end"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Flex h="32px" flexDir="column" mr={4}>
        <Text textStyle="Body/ExtraSmall" color="neutrals.800">
          {isEditing
            ? "Custom Duration"
            : durationSeconds
            ? durationString(durationSeconds)
            : "No Duration Set"}
        </Text>
        <Popover
          placement="bottom-start"
          isOpen={isEditing}
          onOpen={setIsEditing.on}
          onClose={setIsEditing.off}
        >
          <PopoverTrigger>
            <Button
              pt="4px"
              size="sm"
              textStyle="Body/ExtraSmall"
              fontSize="12px"
              lineHeight="8px"
              color="neutrals.500"
              variant="link"
            >
              Edit Duration
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              minW="256px"
              w="min-content"
              borderColor="neutrals.300"
            >
              <PopoverHeader fontWeight="normal" borderColor="neutrals.300">
                Edit Duration
              </PopoverHeader>
              <PopoverArrow
                sx={{
                  "--popper-arrow-shadow-color": "#E5E5E5",
                }}
              />
              <PopoverCloseButton />
              <PopoverBody py={4}>
                <Box>
                  <Box mt={1}>
                    <DurationInput
                      // {...rest}
                      onChange={setDurationSeconds}
                      value={durationSeconds}
                      hideUnusedElements={true}
                      max={group.timeConstraints.maxDurationSeconds}
                      min={60}
                      defaultValue={durationSeconds}
                    >
                      <Weeks />
                      <Days />
                      <Hours />
                      <Minutes />
                      <Button
                        variant="brandSecondary"
                        flexDir="column"
                        fontSize="12px"
                        lineHeight="12px"
                        mr={2}
                        isActive={
                          durationSeconds ==
                          group.timeConstraints.maxDurationSeconds
                        }
                        onClick={handleClickMax}
                        sx={{
                          w: "50%",
                          rounded: "md",
                          borderColor: "neutrals.300",
                          color: "neutrals.800",
                          p: 2,
                          _active: {
                            borderColor: "brandBlue.100",
                            color: "brandBlue.300",
                            bg: "white",
                          },
                        }}
                      >
                        <chakra.span
                          display="block"
                          w="100%"
                          letterSpacing="1.1px"
                        >
                          MAX
                        </chakra.span>
                        {durationString(
                          group.timeConstraints.maxDurationSeconds
                        )}
                      </Button>
                    </DurationInput>
                  </Box>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>
    </Flex>
  );
};

export default Home;
