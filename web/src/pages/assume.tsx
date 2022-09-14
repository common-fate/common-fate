import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MakeGenerics, useNavigate, useSearch } from "react-location";
import { ProviderIcon } from "../components/icons/providerIcon";
import { UserLayout } from "../components/Layout";
import { useAccessRuleLookup } from "../utils/backend-client/default/default";
import { AccessRuleLookupParams } from "../utils/backend-client/types/accessRuleLookupParams";
import { Link } from "react-location";
import { SelectRuleTable } from "../components/tables/SelectRuleTable";

const assume = () => {
  type MyLocationGenerics = MakeGenerics<{
    Search: AccessRuleLookupParams;
  }>;

  const search = useSearch<MyLocationGenerics>();

  const [loadText, setLoadText] = React.useState(
    "Finding your access request now..."
  );

  const navigate = useNavigate();

  const { data, isValidating } = useAccessRuleLookup(search);

  useEffect(() => {
    // Run account lookup
    if (search.accountId && search.roleName && search.type) {
      if (data && data.accessRules.length > 0) {
        if (data.accessRules.length == 1) {
          setLoadText("Access rule found 🚀 Redirecting now...");
          setTimeout(() => {
            // navigate({ to: "/access/request/" + data.accessRules[0].id });
          }, 300);
        } else {
          // add handling for multi rule resolution...
          setLoadText("Multiple access rules found, choose one to continue");
        }
      }
    }
  }, [search, data?.accessRules]);

  return (
    <UserLayout>
      <Center h="80vh">
        <Flex flexDir="column" align="center" textAlign="center" minH="60vh">
          <Spinner my={4} opacity={isValidating ? 1 : 0} />
          {loadText}
          <br />
          {data && data.accessRules.length > 1 && (
            <SelectRuleTable rules={data.accessRules} />
          )}
        </Flex>
      </Center>
    </UserLayout>
  );
};

export default assume;
