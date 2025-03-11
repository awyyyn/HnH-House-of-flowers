import { Notification } from "@/types";

import { atom } from "jotai";

export const notificationAtom = atom<Notification[]>([]);
