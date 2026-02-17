import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { addDays, addMinutes, startOfMonth } from 'date-fns';
import { randomUUID } from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

// Load credentials from environment
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
const PROFESSIONAL_PASSWORD = process.env.SEED_PROFESSIONAL_PASSWORD || 'Senha@123';
const CLIENT_PASSWORD = process.env.SEED_CLIENT_PASSWORD || 'Senha@123';
const SEED_EMAIL_DOMAIN = process.env.SEED_EMAIL_DOMAIN || 'seed.local';

const ADMIN_COUNT = 2;
const PROFESSIONAL_COUNT = 5;
const CLIENT_COUNT = 10;

const PASSWORD_HASH_ROUNDS = 6;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
}

function buildEmail(prefix: string, index: number): string {
  const suffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}.${index}.${suffix}@${SEED_EMAIL_DOMAIN}`;
}

function buildPhone(seed: number): string {
  return `1199${String(seed).padStart(7, '0')}`;
}

function shuffleArray<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

async function main() {
  if (process.env.NODE_ENV !== 'dev') {
    throw new Error('Seed permitido apenas com NODE_ENV=dev');
  }

  console.log('🌱 Começando o seed do banco de dados...\n');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados anteriores...');
  await prisma.couponRedemption.deleteMany();
  await prisma.bonusRedemption.deleteMany();
  await prisma.bonusTransaction.deleteMany();
  await prisma.userBonus.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.holiday.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.serviceProfessional.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.log.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar Usuários
  console.log('\n👤 Criando usuários...');

  const adminNames = ['Administrador 1', 'Administrador 2'];
  const professionalNames = [
    'Pedro Barbeiro',
    'Roberto Silva',
    'Gustavo Oliveira',
    'Marcos Lima',
    'Felipe Santos',
  ];
  const clientNames = [
    'João Silva',
    'Lucas Santos',
    'Fernando Costa',
    'Mariana Oliveira',
    'Carlos Mendes',
    'Ana Souza',
    'Bruno Almeida',
    'Camila Rocha',
    'Diego Martins',
    'Juliana Ribeiro',
  ];

  const adminPasswordHash = await hashPassword(ADMIN_PASSWORD);
  const professionalPasswordHash = await hashPassword(PROFESSIONAL_PASSWORD);
  const clientPasswordHash = await hashPassword(CLIENT_PASSWORD);

  const adminUsers = await Promise.all(
    adminNames.slice(0, ADMIN_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('admin', index + 1),
          password: adminPasswordHash,
          phone: buildPhone(100 + index),
          role: 'ADMIN',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${adminUsers.length} admins criados`);

  const clientUsers = await Promise.all(
    clientNames.slice(0, CLIENT_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('cliente', index + 1),
          password: clientPasswordHash,
          phone: buildPhone(200 + index),
          role: 'CLIENT',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${clientUsers.length} clientes criados`);

  const professionalUsers = await Promise.all(
    professionalNames.slice(0, PROFESSIONAL_COUNT).map((name, index) =>
      prisma.user.create({
        data: {
          name,
          email: buildEmail('profissional', index + 1),
          password: professionalPasswordHash,
          phone: buildPhone(300 + index),
          role: 'PROFESSIONAL',
          emailVerified: true,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${professionalUsers.length} profissionais criados`);

  // 1.1 Criar tokens de verificacao e reset
  console.log('\n🔐 Criando tokens de verificacao e reset...');
  const verificationTokens = await Promise.all(
    clientUsers.slice(0, 4).map((user) =>
      prisma.verificationToken.create({
        data: {
          token: randomUUID(),
          userId: user.id,
          expiresAt: addDays(new Date(), 2),
        },
      }),
    ),
  );
  const passwordResetTokens = await Promise.all(
    clientUsers.slice(0, 3).map((user) =>
      prisma.passwordResetToken.create({
        data: {
          token: randomUUID(),
          userId: user.id,
          expiresAt: addDays(new Date(), 1),
        },
      }),
    ),
  );
  console.log(
    `✅ ${verificationTokens.length} tokens de verificacao e ${passwordResetTokens.length} tokens de reset`,
  );

  // 2. Criar Profissionais
  console.log('\n💼 Criando perfis de profissionais...');

  const specialties = [
    'Corte Clássico',
    'Corte Moderno',
    'Barba e Estilo',
    'Máquina e Acabamento',
    'Corte Rápido',
  ];
  const professionals = await Promise.all(
    professionalUsers.map((user, index) =>
      prisma.professional.create({
        data: {
          userId: user.id,
          specialty: specialties[index % specialties.length],
          bio: `Profissional especializado em ${specialties[index % specialties.length].toLowerCase()}.`,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${professionals.length} profissionais configurados`);

  // 3. Criar Horários de Funcionamento
  console.log('\n⏰ Criando horários de funcionamento...');

  const businessHoursData = [
    // Segunda a Sexta: 09:00 - 19:00 com pausa 12:00 - 13:00
    { dayOfWeek: 1, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 2, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 3, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 4, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    { dayOfWeek: 5, opensAt: '09:00', closesAt: '19:00', breakStart: '12:00', breakEnd: '13:00' },
    // Sábado: 09:00 - 17:00 sem pausa
    { dayOfWeek: 6, opensAt: '09:00', closesAt: '17:00', breakStart: null, breakEnd: null },
  ];

  for (const professional of professionals) {
    await Promise.all(
      businessHoursData.map((hours) =>
        prisma.businessHours.create({
          data: {
            professionalId: professional.id,
            dayOfWeek: hours.dayOfWeek,
            opensAt: hours.opensAt,
            closesAt: hours.closesAt,
            breakStart: hours.breakStart,
            breakEnd: hours.breakEnd,
            active: true,
          },
        }),
      ),
    );
  }
  console.log('✅ Horários de funcionamento criados');

  // 3.1 Criar feriados
  console.log('\n🏖️  Criando feriados...');
  const holidayBase = new Date();
  const holidayReasons = ['Feriado local', 'Descanso', 'Treinamento'];
  const holidaysCreates = professionals.flatMap((professional) => {
    const holidayCount = 1 + Math.floor(Math.random() * 2);
    return Array.from({ length: holidayCount }, (_, index) => {
      const dayOffset = 7 + index + Math.floor(Math.random() * 10);
      return prisma.holiday.create({
        data: {
          professionalId: professional.id,
          date: addDays(holidayBase, dayOffset),
          reason: holidayReasons[index % holidayReasons.length],
        },
      });
    });
  });
  const holidays = await Promise.all(holidaysCreates);
  console.log(`✅ ${holidays.length} feriados criados`);

  // 4. Criar Serviços
  console.log('\n✂️  Criando serviços...');

  const serviceSeeds = [
    {
      name: 'Corte na Tesoura',
      description: 'Corte detalhado na tesoura',
      category: 'Tesoura',
      type: 'CORTE',
      price: 45.0,
      duration: 40,
    },
    {
      name: 'Corte na Maquina',
      description: 'Corte rapido com maquina',
      category: 'Maquina',
      type: 'CORTE',
      price: 30.0,
      duration: 25,
    },
    {
      name: 'Barba Completa',
      description: 'Design e aparo completo de barba',
      category: 'Completa',
      type: 'BARBA',
      price: 40.0,
      duration: 30,
    },
    {
      name: 'Bigode',
      description: 'Modelagem e alinhamento do bigode',
      category: 'Bigode',
      type: 'BARBA',
      price: 20.0,
      duration: 15,
    },
    {
      name: 'Linha do Pescoco',
      description: 'Acabamento na linha do pescoco',
      category: 'Acabamento',
      type: 'BARBA',
      price: 15.0,
      duration: 10,
    },
    {
      name: 'Sobrancelha na Linha',
      description: 'Design com linha para sobrancelha',
      category: 'Linha',
      type: 'SOBRANCELHA',
      price: 18.0,
      duration: 15,
    },
    {
      name: 'Sobrancelha na Pinca',
      description: 'Design com pinca',
      category: 'Pinca',
      type: 'SOBRANCELHA',
      price: 20.0,
      duration: 15,
    },
    {
      name: 'Sobrancelha na Cera',
      description: 'Modelagem com cera',
      category: 'Cera',
      type: 'SOBRANCELHA',
      price: 22.0,
      duration: 20,
    },
    {
      name: 'Sobrancelha na Lamina',
      description: 'Acabamento com lamina',
      category: 'Lamina',
      type: 'SOBRANCELHA',
      price: 15.0,
      duration: 10,
    },
    {
      name: 'Pintura de Cabelo',
      description: 'Aplicacao de tinta para cabelo',
      category: 'Coloracao',
      type: 'ESTETICA',
      price: 80.0,
      duration: 60,
    },
    {
      name: 'Limpeza de Pele',
      description: 'Limpeza e hidratacao facial',
      category: 'Facial',
      type: 'ESTETICA',
      price: 70.0,
      duration: 50,
    },
    {
      name: 'Hidratacao Facial',
      description: 'Hidratacao e revitalizacao da pele',
      category: 'Facial',
      type: 'ESTETICA',
      price: 60.0,
      duration: 40,
    },
    {
      name: 'Mascara de Argila',
      description: 'Tratamento com mascara de argila',
      category: 'Facial',
      type: 'ESTETICA',
      price: 55.0,
      duration: 35,
    },
  ];

  const services = await Promise.all(
    serviceSeeds.map((service) =>
      prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          category: service.category,
          type: service.type,
          active: true,
        },
      }),
    ),
  );
  console.log(`✅ ${services.length} serviços criados`);

  // 5. Vincular Serviços aos Profissionais
  console.log('\n🔗 Vinculando serviços aos profissionais...');

  const durationByServiceId = new Map(
    services.map((service, index) => [service.id, serviceSeeds[index].duration]),
  );
  const priceByServiceId = new Map(
    services.map((service, index) => [service.id, serviceSeeds[index].price]),
  );

  const serviceProfessionalCreates = professionals.flatMap((professional) => {
    const serviceCount = 2 + Math.floor(Math.random() * 3); // 2-4 serviços
    const selectedServices = shuffleArray(services).slice(0, serviceCount);

    return selectedServices.map((service) =>
      prisma.serviceProfessional.create({
        data: {
          serviceId: service.id,
          professionalId: professional.id,
          price: priceByServiceId.get(service.id) ?? 30.0,
          duration: durationByServiceId.get(service.id) ?? 15,
        },
      }),
    );
  });

  const serviceProfessionals = await Promise.all(serviceProfessionalCreates);
  console.log(`✅ ${serviceProfessionals.length} relações de serviço-profissional criadas`);

  // 6. Criar Bônus para Usuários
  console.log('\n🎁 Criando bônus de usuários...');

  await Promise.all([
    ...clientUsers.map((user) =>
      prisma.userBonus.create({
        data: {
          userId: user.id,
          type: 'BOOKING_POINTS',
          points: Math.floor(Math.random() * 300) + 50,
        },
      }),
    ),
    ...clientUsers.map((user) =>
      prisma.userBonus.create({
        data: {
          userId: user.id,
          type: 'LOYALTY',
          points: Math.floor(Math.random() * 500) + 100,
        },
      }),
    ),
  ]);
  console.log('✅ Bônus de usuários criados');

  // 7. Criar Agendamentos (Bookings)
  console.log('\n📅 Criando agendamentos...');

  const today = new Date();
  const monthStart = startOfMonth(today);

  const serviceById = new Map(services.map((service) => [service.id, service]));
  const serviceProfessionalsByProfessional = new Map<string, typeof serviceProfessionals>();
  for (const serviceProfessional of serviceProfessionals) {
    const list = serviceProfessionalsByProfessional.get(serviceProfessional.professionalId) ?? [];
    list.push(serviceProfessional);
    serviceProfessionalsByProfessional.set(serviceProfessional.professionalId, list);
  }

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as const;
  const BOOKING_COUNT = 24;

  const bookings = await Promise.all(
    Array.from({ length: BOOKING_COUNT }, (_, index) => {
      const client = clientUsers[index % clientUsers.length];
      const professional = professionals[Math.floor(Math.random() * professionals.length)];
      const professionalServices = serviceProfessionalsByProfessional.get(professional.id) ?? [];
      const servicesByType = new Map<string, typeof professionalServices>();
      professionalServices.forEach((sp) => {
        const serviceType = serviceById.get(sp.serviceId)?.type ?? 'ESTETICA';
        const group = servicesByType.get(serviceType) ?? [];
        group.push(sp);
        servicesByType.set(serviceType, group);
      });

      const selectedMap = new Map<string, (typeof professionalServices)[number]>();

      const pickRandom = (list: typeof professionalServices) =>
        list.length ? list[Math.floor(Math.random() * list.length)] : undefined;

      const baseTypes = ['CORTE', 'BARBA', 'SOBRANCELHA'];
      const baseType = baseTypes[Math.floor(Math.random() * baseTypes.length)];
      const baseService = pickRandom(servicesByType.get(baseType) ?? []);
      if (baseService) selectedMap.set(baseService.id, baseService);

      const extraTypes = shuffleArray(baseTypes.filter((type) => type !== baseType)).slice(
        0,
        Math.floor(Math.random() * 2),
      );

      extraTypes.forEach((type) => {
        const service = pickRandom(servicesByType.get(type) ?? []);
        if (service) selectedMap.set(service.id, service);
      });

      const esteticaServices = shuffleArray(servicesByType.get('ESTETICA') ?? []).slice(
        0,
        Math.floor(Math.random() * 3),
      );

      esteticaServices.forEach((service) => selectedMap.set(service.id, service));

      if (selectedMap.size === 0) {
        const fallback = pickRandom(professionalServices);
        if (fallback) selectedMap.set(fallback.id, fallback);
      }

      const selectedServiceProfessionals = Array.from(selectedMap.values());

      const dayOffset = Math.floor(Math.random() * 14) - 7;
      const hour = 9 + Math.floor(Math.random() * 8);
      const minute = 15 * Math.floor(Math.random() * 4);

      const startDateTime = addDays(today, dayOffset);
      startDateTime.setHours(hour, minute, 0, 0);

      const totalDuration = selectedServiceProfessionals.reduce((sum, sp) => sum + sp.duration, 0);
      const endDateTime = addMinutes(startDateTime, totalDuration);
      const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
      const totalAmount = selectedServiceProfessionals.reduce((sum, sp) => sum + sp.price, 0);

      return prisma.booking.create({
        data: {
          userId: client.id,
          professionalId: professional.id,
          startDateTime,
          endDateTime,
          status,
          totalAmount,
          canceledAt: status === 'CANCELED' ? addMinutes(startDateTime, -30) : undefined,
          items: {
            create: selectedServiceProfessionals.map((sp) => {
              const service = serviceById.get(sp.serviceId);
              return {
                serviceProfessionalId: sp.id,
                serviceId: sp.serviceId,
                name: service?.name ?? 'Servico',
                price: sp.price,
                duration: sp.duration,
              };
            }),
          },
        },
      });
    }),
  );
  console.log(`✅ ${bookings.length} agendamentos criados`);

  // 8. Criar Cupons
  console.log('\n🎟️  Criando cupons...');

  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'BEMVINDO10',
        description: 'Desconto de boas-vindas para clientes novos',
        type: 'PERCENTAGE',
        value: 10,
        scope: 'GLOBAL',
        expirationType: 'BOTH',
        maxUses: 50,
        startDate: monthStart,
        endDate: addDays(monthStart, 30),
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'CORTE20',
        description: 'Desconto exclusivo em cortes',
        type: 'PERCENTAGE',
        value: 20,
        scope: 'SERVICE',
        serviceId: services[0].id,
        expirationType: 'DATE',
        maxUses: null,
        startDate: monthStart,
        endDate: addDays(monthStart, 90),
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'FIDELIDADE30',
        description: 'Cupom de fidelidade - R$ 30 de desconto',
        type: 'FIXED',
        value: 30,
        scope: 'GLOBAL',
        minBookingValue: 100,
        expirationType: 'QUANTITY',
        maxUses: 100,
        startDate: monthStart,
        endDate: null,
        active: true,
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'PEDRO50',
        description: 'Desconto com profissional Pedro',
        type: 'PERCENTAGE',
        value: 15,
        scope: 'PROFESSIONAL',
        professionalId: professionals[0].id,
        expirationType: 'BOTH',
        maxUses: 200,
        startDate: monthStart,
        endDate: addDays(monthStart, 60),
        active: true,
      },
    }),
  ]);
  console.log(`✅ ${coupons.length} cupons criados`);

  // 9. Criar resgates, transacoes e logs
  console.log('\n🧾 Criando logs, transacoes e resgates...');
  const completedBookings = bookings.filter((booking) => booking.status === 'COMPLETED');
  const bonusTransactions = await Promise.all(
    completedBookings.slice(0, 8).map((booking, index) =>
      prisma.bonusTransaction.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          points: 10 + index * 2,
          type: 'BOOKING_POINTS',
          operation: 'CREDIT',
          description: 'Pontos por agendamento concluido',
        },
      }),
    ),
  );

  const bonusRedemptions = await Promise.all(
    bookings.slice(0, 4).map((booking, index) =>
      prisma.bonusRedemption.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          pointsUsed: 50 + index * 10,
          discount: 10 + index * 5,
        },
      }),
    ),
  );

  await Promise.all(
    bonusRedemptions.map((redemption) =>
      prisma.bonusTransaction.create({
        data: {
          userId: redemption.userId,
          bookingId: redemption.bookingId,
          points: redemption.pointsUsed,
          type: 'BOOKING_POINTS',
          operation: 'DEBIT',
          description: 'Resgate de pontos no agendamento',
        },
      }),
    ),
  );

  const couponTarget = coupons[0];
  const couponTargetBookings = bookings.slice(0, 5);
  const couponRedemptions = await Promise.all(
    couponTargetBookings.map(async (booking) => {
      const discount = Math.min(booking.totalAmount * 0.1, booking.totalAmount);
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          couponId: couponTarget.id,
          couponDiscount: discount,
        },
      });
      return prisma.couponRedemption.create({
        data: {
          couponId: couponTarget.id,
          userId: booking.userId,
          bookingId: booking.id,
          discount,
        },
      });
    }),
  );

  await prisma.coupon.update({
    where: { id: couponTarget.id },
    data: { uses: { increment: couponRedemptions.length } },
  });

  const logsData = bookings.slice(0, 8).map((booking, index) => ({
    userId: booking.userId,
    type: index % 2 === 0 ? 'BOOKING_CREATE' : 'STATUS_UPDATE',
    description:
      index % 2 === 0 ? 'Agendamento criado via seed' : `Status atualizado para ${booking.status}`,
    reference: booking.id,
    entity: 'Booking',
  }));

  logsData.push(
    ...services.slice(0, 4).map((service) => ({
      userId: adminUsers[0]?.id ?? null,
      type: 'SERVICE_CREATE',
      description: `Servico ${service.name} criado no seed`,
      reference: service.id,
      entity: 'Service',
    })),
  );

  await prisma.log.createMany({ data: logsData });
  console.log(
    `✅ ${bonusTransactions.length} transacoes de bonus, ${bonusRedemptions.length} resgates e ${couponRedemptions.length} cupons resgatados`,
  );

  console.log('\n✨ Seed concluído com sucesso!\n');
  console.log('📋 Dados criados:');
  console.log(`  - ${adminUsers.length} Admins`);
  console.log(`  - ${clientUsers.length} Clientes`);
  console.log(`  - ${professionals.length} Profissionais`);
  console.log(`  - ${services.length} Serviços`);
  console.log(`  - ${serviceProfessionals.length} Relações Serviço-Profissional`);
  console.log(`  - ${bookings.length} Agendamentos`);
  console.log(`  - ${holidays.length} Feriados`);
  console.log(`  - ${coupons.length} Cupons`);
  console.log(`  - ${verificationTokens.length} Tokens de verificação`);
  console.log(`  - ${passwordResetTokens.length} Tokens de reset`);
  console.log(`  - ${bonusTransactions.length} Transações de bônus`);
  console.log(`  - ${bonusRedemptions.length} Resgates de bônus`);
  console.log(`  - ${couponRedemptions.length} Resgates de cupom`);
  console.log(`  - ${logsData.length} Logs`);
  console.log('\n🔐 Senhas padrão (.env):');
  console.log(`  Admins: ${ADMIN_PASSWORD}`);
  console.log(`  Profissionais: ${PROFESSIONAL_PASSWORD}`);
  console.log(`  Clientes: ${CLIENT_PASSWORD}`);
  console.log('\n📧 Emails gerados:');
  console.log(`  Admins: ${adminUsers.map((user) => user.email).join(', ')}`);
  console.log(`  Profissionais: ${professionalUsers.map((user) => user.email).join(', ')}`);
  console.log(`  Clientes: ${clientUsers.map((user) => user.email).join(', ')}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
