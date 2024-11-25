
export type BlogInputModel = {
  /** maxLength: 15 */
  name: string;
  /** maxLength: 500 */
  description: string;
  /** maxLength: 100 */
  websiteUrl: typeof websiteUrlPattern;
};

export const websiteUrlPattern: RegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
