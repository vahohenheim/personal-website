import { IconProps } from "../icon.model";

const LinkedinIcon = ({ width, height, className }: IconProps) => {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 23 22" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.0107 7.5C16.602 7.5 18.1282 8.13214 19.2534 9.25736C20.3786 10.3826 21.0107 11.9087 21.0107 13.5V20.5H17.0107V13.5C17.0107 12.9696 16.8 12.4609 16.425 12.0858C16.0499 11.7107 15.5412 11.5 15.0107 11.5C14.4803 11.5 13.9716 11.7107 13.5965 12.0858C13.2215 12.4609 13.0107 12.9696 13.0107 13.5V20.5H9.01074V13.5C9.01074 11.9087 9.64288 10.3826 10.7681 9.25736C11.8933 8.13214 13.4194 7.5 15.0107 7.5Z"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.01074 8.5H1.01074V20.5H5.01074V8.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" />
      <path
        d="M3.01074 5.5C4.11531 5.5 5.01074 4.60457 5.01074 3.5C5.01074 2.39543 4.11531 1.5 3.01074 1.5C1.90617 1.5 1.01074 2.39543 1.01074 3.5C1.01074 4.60457 1.90617 5.5 3.01074 5.5Z"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default LinkedinIcon
