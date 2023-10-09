-- ログイン認証はメールではなく任意文字列ユーザIDを利用する仕様で確定したためカラム名の変更およびユニークインデックスの定義
ALTER TABLE user CHANGE COLUMN mail user_id varchar(128) NOT NULL comment 'ユーザID:ログインする時のID';
CREATE UNIQUE INDEX user_id_unique_idx ON user(user_id,existence);
-- カラム位置も調整
ALTER TABLE user MODIFY name varchar(128) NOT NULL AFTER user_type;

- 共通カラムへの自己参照キー
ALTER TABLE user
    ADD CONSTRAINT user_fk_created_by FOREIGN KEY (created_by) REFERENCES user(id);
ALTER TABLE pharmacy
    ADD CONSTRAINT user_fk_updated_by FOREIGN KEY (updated_by) REFERENCES user(id);