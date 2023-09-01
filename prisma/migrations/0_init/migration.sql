create table user (
  id VARCHAR(64) not null comment 'ID'
  , mail VARCHAR(128) not null comment 'メールアドレス'
  , name VARCHAR(128) not null comment '氏名'
  , name_kana VARCHAR(128) not null comment '氏名（カナ）'
  , password VARCHAR(255) comment 'パスワード'
  , staff_flag BOOL not null comment 'スタッフフラグ:true: スタッフ, false: 患者'
  , created_at TIMESTAMP NULL default NULL comment '登録日時'
  , created_by VARCHAR(64) comment '登録ユーザーID'
  , updated_at TIMESTAMP NULL default NULL comment '更新日時'
  , updated_by VARCHAR(64) comment '更新ユーザーID'
  , deleted_at TIMESTAMP NULL default NULL comment '削除日時'
  , existence boolean as (CASE WHEN deleted_at IS NULL THEN 1 ELSE NULL END) comment '削除有無:1:有効 NULL:論理削除'
  , constraint user_PKC primary key (id)
) comment 'ユーザー:スタッフと患者の基本情報としてユーザーを定義している
MyPage の構想があるので、とりあえず同じ枠に入れている' ;

-- CreateTable
CREATE TABLE `company` (
    `id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `postal_code` CHAR(7) NOT NULL,
    `address1` VARCHAR(128) NOT NULL,
    `address2` VARCHAR(128) NULL,
    `telephone` VARCHAR(16) NOT NULL,
    `fax` VARCHAR(16) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(64) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `updated_by` VARCHAR(64) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `existence` BOOLEAN NULL,

    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `pharmacy` (
    `id` VARCHAR(64) NOT NULL,
    `company_id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `code` VARCHAR(16) NOT NULL,
    `nsips_code` VARCHAR(16) NULL,
    `postal_code` CHAR(7) NOT NULL,
    `address1` VARCHAR(128) NOT NULL,
    `address2` VARCHAR(128) NULL,
    `tel` VARCHAR(16) NOT NULL,
    `fax` VARCHAR(16) NULL,
    `invoice_no` CHAR(14) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(64) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `updated_by` VARCHAR(64) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `existence` BOOLEAN NULL,

    INDEX `pharmacy_FK1`(`company_id`),
    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `pharmacy_base_compounding_setting` (
    `id` VARCHAR(64) NOT NULL,
    `pharmacy_id` VARCHAR(64) NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `score` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL DEFAULT '2100-01-01',
    `created_at` TIMESTAMP(0) NULL,
    `created_by` VARCHAR(64) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `updated_by` VARCHAR(64) NULL,
    `deleted_at` TIMESTAMP(0) NULL,
    `existence` BOOLEAN NULL,

    INDEX `pharmacy_base_compounding_setting_FK1`(`pharmacy_id`),
    PRIMARY KEY (`id`)
);


-- AddForeignKey
ALTER TABLE `pharmacy` ADD CONSTRAINT `pharmacy_FK1` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pharmacy_base_compounding_setting` ADD CONSTRAINT `pharmacy_base_compounding_setting_FK1` FOREIGN KEY (`pharmacy_id`) REFERENCES `pharmacy`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;


INSERT
INTO user(
    id                                          -- ID
    , mail                                      -- メールアドレス
    , name                                      -- 氏名
    , name_kana                                 -- 氏名（カナ）
    , password                                  -- パスワード
    , staff_flag                                -- スタッフフラグ
    , created_at                                -- 登録日時
    , created_by                                -- 登録ユーザーID
    , updated_at                                -- 更新日時
    , updated_by                                -- 更新ユーザーID
    , deleted_at                                -- 削除日時
)
VALUES (
    '2'
    ,'demo555@upstream-j.co.jp'
    , 'Admin User'
    , 'アドミンユーザ'
    , 'test'
    , true
    , now()
    , null
    , now()
    , null
    , null
);

alter table company
  add constraint company_FK1 foreign key (updated_by) references user(id);

alter table company
  add constraint company_FK2 foreign key (created_by) references user(id);
