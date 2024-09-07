import { Avatar, Box, Text, Card, Flex, Button } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { FaFileDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const MembersList = ({ members, onEdit, onDelete, onPreview }) => {
  return (
    <div className="w-full">
      {members.map((member) => (
        <Box key={member.id} className="w-full">
          <Card className="w-full">
            <Flex
              gap="3"
              align="center"
              justify="between"
              width="100%"
              padding="4"
            >
              <Flex gap="3" align={"center"}>
                {/* Avatar */}
                <Avatar
                  size="1"
                  src={
                    member.avatar ||
                    "https://w7.pngwing.com/pngs/152/155/png-transparent-male-man-person-business-avatar-icon.png"
                  } // Placeholder if no avatar available
                  radius="full"
                  className="max-h-[50px] max-w-[50px]"
                  fallback={member.name.charAt(0).toUpperCase()}
                />
                {/* Member Info */}
                <Box>
                  <Text as="div" size="2" weight="bold">
                    {member.name}
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {member.membershipType} Membership
                  </Text>
                  <Text as="div" size="2" color="gray">
                    {member.email}
                  </Text>
                </Box>
              </Flex>

              {/* Actions */}
              <Box>
                <Flex gap="2">
                  {/* Edit Button */}
                  <Button
                    onClick={() => onEdit(member.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    <FaRegEdit />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    onClick={() => onDelete(member.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    <MdDelete />
                  </Button>

                  {/* Preview Button */}
                  <Button
                    onClick={() => onPreview(member)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    <FaFileDownload />
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Box>
      ))}
    </div>
  );
};

export default MembersList;
