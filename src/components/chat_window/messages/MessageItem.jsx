import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../context/current-room.context";
import { useHover, useMediaQuery } from "../../../misc/custom-hooks";
import { auth } from "../../../misc/firebase.config";
import PresenceDot from "../../PresenceDot";
import ProfileAvatar from "../../ProfileAvatar";
import IconBtnControl from "./IconBtnControl";
import ImgBtnModal from "./ImgBtnModal";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import FileAttachment from "./FileAttachment";

const renderFileMessage = (file) => {
  // Handle images (both base64 and regular)
  if (file.contentType.includes("image")) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  // Handle audio files with custom player
  if (file.contentType.includes("audio")) {
    return (
      <div className="audio-message">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls>
          <source src={file.url} type={file.contentType} />
          Your browser does not support the audio element.
        </audio>
        <div className="audio-timestamp" style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '2px' }}>
          Audio message
        </div>
      </div>
    );
  }

  // For all other file types, use the FileAttachment component
  return <FileAttachment file={file} />;
};

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, file, likes, likeCount } = message;

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery("(max-width: 992px)");

  const isAdmin = useCurrentRoom((v) => v.isAdmin);
  const admins = useCurrentRoom((v) => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? "bg-black-02" : ""} ${isAuthor ? "current-user" : ""}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />

        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />

        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button
              block
              onClick={() => handleAdmin(author.uid)}
              color="blue"
              appearance="primary"
            >
              {isMsgAuthorAdmin
                ? "Remove admin permission"
                : "Give admin in this room"}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />

        <IconBtnControl
          {...(isLiked ? { color: "red" } : {})}
          isVisible={canShowIcons}
          iconName="heart"
          tooltip="Like this message"
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            iconName="close"
            tooltip="Delete this message"
            onClick={() => handleDelete(message.id, file)}
          />
        )}
      </div>

      <div>
        {text && <span className="word-break-all">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
