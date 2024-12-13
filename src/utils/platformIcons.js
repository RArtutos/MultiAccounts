export const platformIcons = {
  netflix: '<img src="https://www.netflix.com/favicon.ico" alt="Netflix" class="platform-icon">',
  hbo: '<img src="https://www.hbomax.com/favicon.ico" alt="HBO" class="platform-icon">',
  disney: '<img src="https://www.disneyplus.com/favicon.ico" alt="Disney+" class="platform-icon">',
  prime: '<img src="https://www.primevideo.com/favicon.ico" alt="Prime Video" class="platform-icon">',
  spotify: '<img src="https://www.spotify.com/favicon.ico" alt="Spotify" class="platform-icon">',
  youtube: '<img src="https://www.youtube.com/favicon.ico" alt="YouTube" class="platform-icon">',
  default: '🎬'
};

export function getPlatformIcon(platform) {
  return platformIcons[platform.toLowerCase()] || platformIcons.default;
}