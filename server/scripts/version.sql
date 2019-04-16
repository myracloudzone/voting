CREATE TABLE `Party`
(
  `id` varchar
(50) NOT NULL,
  `name` varchar
(100) NOT NULL,
  `code` varchar
(50) NOT NULL,
  `symbol` varchar
(255) DEFAULT NULL,
  `active` tinyint
(1) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `code_UNIQUE`
(`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `PartyMember`
(
  `id` varchar
(50) NOT NULL,
  `name` varchar
(100) NOT NULL,
  `code` varchar
(50) NOT NULL,
  `active` tinyint
(1) NOT NULL,
  `partyId` varchar
(50) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `code_UNIQUE`
(`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `User`
(
  `id` varchar
(45) NOT NULL,
  `email` varchar
(100) NOT NULL,
  `username` varchar
(100) NOT NULL,
  `password` varchar
(100) NOT NULL,
  `active` tinyint
(1) NOT NULL,
  `role` varchar
(10) NOT NULL,
  `voterId` varchar
(50) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `email_UNIQUE`
(`email`),
  UNIQUE KEY `username_UNIQUE`
(`username`),
  UNIQUE KEY `voterId_UNIQUE`
(`voterId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `UserSession`
(
  `id` varchar
(50) NOT NULL,
  `username` varchar
(50) NOT NULL,
  `lastHit` bigint
(20) NOT NULL,
  `active` tinyint
(1) NOT NULL,
  `uuid` varchar
(100) NOT NULL,
  `role` varchar
(50) NOT NULL,
  `voterId` varchar
(50) DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Voter`
(
  `id` varchar
(50) NOT NULL,
  `name` varchar
(100) NOT NULL,
  `email` varchar
(100) NOT NULL,
  `active` tinyint
(1) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `email_UNIQUE`
(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Voting`
(
  `id` varchar
(50) NOT NULL,
  `partyMemberId` varchar
(50) NOT NULL,
  `voterId` varchar
(50) NOT NULL,
  `dateCreated` bigint
(11) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
