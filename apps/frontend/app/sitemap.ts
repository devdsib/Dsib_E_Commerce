import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dsibtech.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const productSlugs = [
    "arduino-uno-r3-development-board",
    "esp32-devkit-v1-wifi-bluetooth",
    "raspberry-pi-4-model-b-4gb",
    "ultrasonic-sensor-hc-sr04",
    "universal-robotics-trainer-kit-v01",
    "servo-motor-sg90-micro",
    "oled-display-128x64-i2c-ssd1306",
    "lm2596-dc-dc-buck-converter",
    "stem-iot-smart-home-kit",
    "jumper-wire-kit-120pcs",
    "drone-frame-f450-quadcopter",
    "ne555-timer-ic-dip8",
  ];

  const productPages = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Use correct /products?cat= URL format (not /category/ which doesn't exist)
  const categorySlugs = ["arduino", "raspberry-pi", "esp32", "sensors", "robotics-kits", "motors", "displays", "power-modules", "stem-kits"];
  const categoryPages = categorySlugs.map((slug) => ({
    url: `${baseUrl}/products?cat=${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
