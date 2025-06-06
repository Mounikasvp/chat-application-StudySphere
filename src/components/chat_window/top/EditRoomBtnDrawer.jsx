import { ref, set } from "firebase/database";
import React, { memo } from "react";
import { useParams } from "react-router";
import { Button, Drawer } from "rsuite";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useMediaQuery, useModalState } from "../../../misc/custom-hooks";
import { database } from "../../../misc/firebase.config";
import EditableInput from "../../EditableInput";
import { showSuccessAlert, showErrorAlert } from "../../../misc/sweet-alert";

const EditRoomBtnDrawer = () => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();
  const isMobile = useMediaQuery("(max-width: 992px)");

  const name = useCurrentRoom((v) => v.name);
  const description = useCurrentRoom((v) => v.description);

  const updateData = (key, value) => {
    set(ref(database, `/rooms/${chatId}/${key}`), value)
      .then(() => {
        // Use SweetAlert2 success alert
        showSuccessAlert(
          'Updated',
          `Room ${key} has been successfully updated`
        );
      })
      .catch((err) => {
        // Use SweetAlert2 error alert
        showErrorAlert(
          'Error',
          err.message
        );
      });
  };

  const onNameSave = (newName) => {
    updateData("name", newName);
  };

  const onDescriptionSave = (newDesc) => {
    updateData("description", newDesc);
  };

  return (
    <>
      <Button className="br-circle" size="sm" color="red" onClick={open} appearance="primary">
        A
      </Button>

      <Drawer
        size={isMobile ? "full" : "md"}
        open={isOpen}
        onClose={close}
        placement="right"
      >
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div style={{ height: "90%" }}>
            <EditableInput
              initialValue={name}
              onSave={onNameSave}
              label={<h6 className="mb-2">Name</h6>}
              emptyMsg="Name can not be empty"
            />
            <EditableInput
              as="textarea"
              rows={5}
              initialValue={description}
              onSave={onDescriptionSave}
              emptyMsg="Description can not be empty"
              wrapperClassName="mt-3"
            />
          </div>
          <div style={{ height: "10%" }}>
            <Drawer.Actions>
              <Button block onClick={close}>
                Close
              </Button>
            </Drawer.Actions>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
};

export default memo(EditRoomBtnDrawer);
