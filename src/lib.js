import { format, isToday, isYesterday } from "date-fns";

export const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.seconds) return "Unknown date";

    const date = new Date(dateObj.seconds * 1000);

    if (isToday(date)) {
        return `Today, ${format(date, "p")}`;
    }

    if (isYesterday(date)) {
        return `Yesterday, ${format(date, "p")}`;
    }

    return format(date, "MMM d, yyyy, p");
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024; // Size factor (1 KB = 1024 bytes)
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k)); // Determine the size index

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
