import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();


async function main() {

    //* 👤 Create a user
    const adminUser = await prisma.user.create({
        data: {
            email: 'dan',
            username: 'abstractsins',
            password: await bcrypt.hash('berlin', 10),
            nickname: 'superUser'
        },
    });

    const regUser = await prisma.user.create({
        data: {
            email: 'fake1@fake.com',
            username: 'fake1',
            password: await bcrypt.hash('test', 10),
            nickname: 'Test User 1'
        },
    });

    const regUser2 = await prisma.user.create({
        data: {
            email: 'fake2@fake.com',
            username: 'fake2',
            password: await bcrypt.hash('test', 10),
            nickname: 'Test User 2'
        },
    });


    //* 🧂 Create some default tags
    // * INGREDIENT
    const meatTag = await prisma.tag.create({
        data: {
            name: 'frozen',
            type: 'ingredient',
            createdBy: null,
        },
    });

    const notVeganTag = await prisma.tag.create({
        data: {
            name: 'not vegan',
            type: 'ingredient',
            createdBy: null,
        },
    });

    const vegan = await prisma.tag.create({
        data: {
            name: 'vegan',
            type: 'ingredient',
            createdBy: null,
        },
    });

    const spicyIngredientTag = await prisma.tag.create({
        data: {
            name: 'spicy',
            type: 'ingredient',
            createdBy: null,
        },
    });

    const driedTag = await prisma.tag.create({
        data: {
            name: 'dried',
            type: 'ingredient',
            createdBy: null,
        },
    });

    const cannedTag = await prisma.tag.create({
        data: {
            name: 'canned',
            type: 'ingredient',
            createdBy: null,
        },
    });

    // * RECIPE
    const spicyRecipeTag = await prisma.tag.create({
        data: {
            name: 'spicy',
            type: 'recipe',
            createdBy: null,
        },
    });

    const quickTag = await prisma.tag.create({
        data: {
            name: 'quick',
            type: 'recipe',
            createdBy: null,
        },
    });

    const fried = await prisma.tag.create({
        data: {
            name: 'fried',
            type: 'recipe',
            createdBy: null,
        },
    });

    const onePot = await prisma.tag.create({
        data: {
            name: 'one pot',
            type: 'recipe',
            createdBy: null,
        },
    });


    //* 🧂 Create some user tags
    //* * USER RECIPES
    const jewishTag = await prisma.tag.create({
        data: {
            name: 'Jewish',
            type: 'recipe',
            createdBy: adminUser.id,
        },
    });

    const freezableTag = await prisma.tag.create({
        data: {
            name: 'freezable',
            type: 'recipe',
            createdBy: adminUser.id,
        },
    });

    const freezable2Tag = await prisma.tag.create({
        data: {
            name: 'freezable',
            type: 'recipe',
            createdBy: regUser2.id,
        },
    });

    const makeAhead = await prisma.tag.create({
        data: {
            name: 'make ahead',
            type: 'recipe',
            createdBy: regUser2.id,
        },
    });

    const veryDairy = await prisma.tag.create({
        data: {
            name: 'very dairy',
            type: 'recipe',
            createdBy: regUser.id,
        },
    });

    const amberApproved = await prisma.tag.create({
        data: {
            name: 'Amber approved',
            type: 'recipe',
            createdBy: regUser.id,
        },
    });

    //* * USER INGREDIENTS
    const expensive = await prisma.tag.create({
        data: {
            name: 'expensive',
            type: 'ingredient',
            createdBy: adminUser.id,
        },
    });

    const getAtWholeFoods = await prisma.tag.create({
        data: {
            name: 'get at WF',
            type: 'ingredient',
            createdBy: regUser.id,
        },
    });

    const betterFresh = await prisma.tag.create({
        data: {
            name: 'better fresh',
            type: 'ingredient',
            createdBy: regUser2.id,
        },
    });

    const betterCanned = await prisma.tag.create({
        data: {
            name: 'better canned',
            type: 'ingredient',
            createdBy: regUser2.id,
        },
    });


    //* 🥕 Create an ingredient
    const beef = await prisma.ingredient.create({
        data: {
            name: 'ground beef 90/10',
            main: 'beef',
            variety: 'ground, 90/10',
            category: 'meat',
            subcategory: 'beef',
            userId: adminUser.id,
            tags: { connect: [{ id: meatTag.id }] },
        },
    });

    const onion = await prisma.ingredient.create({
        data: {
            name: 'white onion',
            main: 'onion',
            variety: 'white',
            category: 'vegetable',
            subcategory: 'root',
            userId: adminUser.id,
            tags: { connect: [] },
        },
    });

    const largeEgg = await prisma.ingredient.create({
        data: {
            name: 'large egg',
            main: 'egg',
            variety: 'large',
            userId: adminUser.id,
            tags: { connect: [] },
        },
    });

    const sage = await prisma.ingredient.create({
        data: {
            name: 'sage',
            category: 'herb',
            userId: adminUser.id,
            tags: { connect: [{ id: driedTag.id }] },
        },
    });

    const carrot = await prisma.ingredient.create({
        data: {
            name: 'carrot',
            main: 'carrot',
            category: 'vegetable',
            subcategory: 'root',
            userId: adminUser.id,
            tags: { connect: [] },
        },
    });

    const milk = await prisma.ingredient.create({
        data: {
            name: 'milk',
            main: 'main',
            variety: 'whole',
            category: 'dairy',
            userId: adminUser.id,
            tags: { connect: [] },
        },
    });

    const carrot2 = await prisma.ingredient.create({
        data: {
            name: 'carrot',
            main: 'carrot',
            category: 'vegetable',
            subcategory: 'root',
            userId: regUser.id,
            tags: { connect: [] },
        },
    });

    const milk2 = await prisma.ingredient.create({
        data: {
            name: 'milk',
            main: 'main',
            variety: 'whole',
            category: 'dairy',
            userId: regUser.id,
            tags: { connect: [] },
        },
    });

    const carrot3 = await prisma.ingredient.create({
        data: {
            name: 'carrot',
            main: 'carrot',
            category: 'vegetable',
            subcategory: 'root',
            userId: regUser2.id,
            tags: { connect: [] },
        },
    });

    const milk3 = await prisma.ingredient.create({
        data: {
            name: 'milk',
            main: 'main',
            variety: 'whole',
            category: 'dairy',
            userId: regUser2.id,
            tags: { connect: [] },
        },
    });

    //* 🍝 Create a recipe
    const meatloaf1 = await prisma.recipe.create({
        data: {
            name: 'meatloaf',
            userId: adminUser.id,
            tags: { connect: [{ id: quickTag.id }] },
            ingredients: { connect: [] },
        },
    });

    const meatloaf2 = await prisma.recipe.create({
        data: {
            name: 'meatloaf',
            userId: regUser.id,
            tags: { connect: [{ id: quickTag.id }] },
            ingredients: { connect: [] },
        },
    });

    await prisma.user.update({
        where: { email: 'dan' },
        data: { role: 'admin' },
    });


    console.log('Seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
