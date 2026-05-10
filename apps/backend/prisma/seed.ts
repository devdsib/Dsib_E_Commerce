import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with all products...");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "arduino" }, update: {}, create: { name: "Arduino", slug: "arduino", description: "Development boards and shields" } }),
    prisma.category.upsert({ where: { slug: "esp32" }, update: {}, create: { name: "ESP32 & IoT", slug: "esp32", description: "WiFi and Bluetooth modules" } }),
    prisma.category.upsert({ where: { slug: "raspberry-pi" }, update: {}, create: { name: "Raspberry Pi", slug: "raspberry-pi", description: "Single board computers" } }),
    prisma.category.upsert({ where: { slug: "sensors" }, update: {}, create: { name: "Sensors", slug: "sensors", description: "Environmental and motion sensors" } }),
    prisma.category.upsert({ where: { slug: "robotics" }, update: {}, create: { name: "Robotics Kits", slug: "robotics", description: "Complete robotics learning kits" } }),
    prisma.category.upsert({ where: { slug: "motors" }, update: {}, create: { name: "Motors", slug: "motors", description: "Servo and stepper motors" } }),
    prisma.category.upsert({ where: { slug: "displays" }, update: {}, create: { name: "Displays", slug: "displays", description: "LCD, OLED and TFT displays" } }),
    prisma.category.upsert({ where: { slug: "power" }, update: {}, create: { name: "Power Modules", slug: "power", description: "Voltage regulators and converters" } }),
    prisma.category.upsert({ where: { slug: "stem-kits" }, update: {}, create: { name: "STEM Kits", slug: "stem-kits", description: "Educational STEM project kits" } }),
    prisma.category.upsert({ where: { slug: "drones" }, update: {}, create: { name: "Drones", slug: "drones", description: "Quadcopter frames and parts" } }),
    prisma.category.upsert({ where: { slug: "ics" }, update: {}, create: { name: "ICs & Semiconductors", slug: "ics", description: "Integrated circuits and components" } }),
    prisma.category.upsert({ where: { slug: "connectors" }, update: {}, create: { name: "Connectors", slug: "connectors", description: "Jumper wires and connectors" } }),
  ]);

  const catMap: Record<string, string> = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  const products = [
    { sku: "ARD-UNO-R3", name: "Arduino Uno R3 ATmega328P Development Board", slug: "arduino-uno-r3-development-board", price: 899, discountPrice: 549, stock: 150, categorySlug: "arduino", brand: "Arduino", featured: true },
    { sku: "ESP32-DEVKIT-V1", name: "ESP32 DevKit V1 WiFi + Bluetooth Development Board", slug: "esp32-devkit-v1-wifi-bluetooth", price: 599, discountPrice: 399, stock: 230, categorySlug: "esp32", brand: "Espressif", featured: true },
    { sku: "RPI4-4GB", name: "Raspberry Pi 4 Model B - 4GB RAM", slug: "raspberry-pi-4-model-b-4gb", price: 5499, discountPrice: 4799, stock: 45, categorySlug: "raspberry-pi", brand: "Raspberry Pi Foundation", featured: true },
    { sku: "SEN-HCSR04", name: "HC-SR04 Ultrasonic Distance Sensor Module", slug: "ultrasonic-sensor-hc-sr04", price: 99, discountPrice: 59, stock: 500, categorySlug: "sensors", brand: "Generic", featured: false },
    { sku: "DSIB-URTK-V01", name: "Universal Robotics Trainer Kit V0.1", slug: "universal-robotics-trainer-kit-v01", price: 7999, discountPrice: 4999, stock: 32, categorySlug: "robotics", brand: "DSIB Tech", featured: true },
    { sku: "MOT-SG90", name: "SG90 Micro Servo Motor 9g", slug: "servo-motor-sg90-micro", price: 149, discountPrice: 89, stock: 800, categorySlug: "motors", brand: "TowerPro", featured: false },
    { sku: "DISP-OLED-128x64", name: "0.96\" OLED Display Module 128x64 I2C SSD1306", slug: "oled-display-128x64-i2c-ssd1306", price: 249, discountPrice: 159, stock: 340, categorySlug: "displays", brand: "Generic", featured: true },
    { sku: "PWR-LM2596", name: "LM2596 DC-DC Step Down Buck Converter Module", slug: "lm2596-dc-dc-buck-converter", price: 79, discountPrice: 49, stock: 620, categorySlug: "power", brand: "Generic", featured: false },
    { sku: "DSIB-STEM-IOT-01", name: "STEM IoT Smart Home Learning Kit", slug: "stem-iot-smart-home-kit", price: 3999, discountPrice: 2999, stock: 55, categorySlug: "stem-kits", brand: "DSIB Tech", featured: true },
    { sku: "WIRE-JMP-120", name: "Jumper Wire Kit 120pcs (M-M, M-F, F-F)", slug: "jumper-wire-kit-120pcs", price: 199, discountPrice: 129, stock: 1200, categorySlug: "connectors", brand: "Generic", featured: false },
    { sku: "DRN-F450", name: "F450 Quadcopter Drone Frame Kit with Landing Gear", slug: "drone-frame-f450-quadcopter", price: 799, discountPrice: 599, stock: 67, categorySlug: "drones", brand: "DJI Compatible", featured: false },
    { sku: "IC-NE555", name: "NE555 Timer IC DIP-8 (Pack of 5)", slug: "ne555-timer-ic-dip8", price: 49, discountPrice: undefined, stock: 3000, categorySlug: "ics", brand: "Texas Instruments", featured: false },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        stockQuantity: p.stock,
        isFeatured: p.featured,
      },
      create: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: `${p.name} - Available at DSIB Tech.`,
        price: p.price,
        discountPrice: p.discountPrice ?? null,
        stockQuantity: p.stock,
        categoryId: catMap[p.categorySlug],
        brand: p.brand,
        isFeatured: p.featured,
        status: "PUBLISHED",
        specifications: {},
      },
    });
    console.log(`  ✓ ${p.name}`);
  }

  console.log("\n✅ All 12 products seeded successfully.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
