export const enum Role {
  Admin = 'admin',
  User = 'user',
}

export const enum LoginType {
  Xprv = 'xPriv',
  AccessKey = 'Access Key',
}

export type TRole = Role | null | undefined;
