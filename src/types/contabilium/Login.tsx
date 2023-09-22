import { LoginProps } from ".";

export type Login = ({ cbUser, cbPass, accountType }: LoginProps) => Promise<boolean>;