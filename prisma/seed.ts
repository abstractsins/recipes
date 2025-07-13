import { PrismaClient, TagType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    /* ─────────── Seasons ─────────── */
    const [fall, winter, spring, summer] = await Promise.all(
        ['Fall', 'Winter', 'Spring', 'Summer'].map(name =>
            prisma.season.create({ data: { name } })
        )
    );

    /* ─────────── Super Users ─────────── */
    const adminUser = await prisma.user.create({
        data: {
            email: 'dan',
            username: 'abstractsins',
            password: await bcrypt.hash('berlin', 10),
            nickname: 'superUser',
            role: 'admin'
        }
    });

    /* ─────────── Users ─────────── */
    const [regUser, regUser2] = await Promise.all([
        prisma.user.create({
            data: {
                email: 'fake1@fake.com',
                username: 'fake1',
                password: await bcrypt.hash('test', 10),
                nickname: 'Test User 1',
            },
        }),
        prisma.user.create({
            data: {
                email: 'fake2@fake.com',
                username: 'fake2',
                password: await bcrypt.hash('test', 10),
                nickname: 'Test User 2',
            },
        })
    ]);

    /* ─────────── Default tags ─────────── */
    const [
        spicyRecipeTag,
        quickRecipeTag,
        friedRecipeTag,
        onePotRecipeTag,
        meatTag,
        notVeganTag,
        veganTag,
        spicyIngTag,
        driedTag,
        cannedTag,
    ] = await Promise.all(
        [
            { name: 'spicy', type: TagType.recipe },
            { name: 'quick', type: TagType.recipe },
            { name: 'fried', type: TagType.recipe },
            { name: 'one pot', type: TagType.recipe },
            { name: 'frozen', type: TagType.ingredient },
            { name: 'not vegan', type: TagType.ingredient },
            { name: 'vegan', type: TagType.ingredient },
            { name: 'spicy', type: TagType.ingredient },
            { name: 'dried', type: TagType.ingredient },
            { name: 'canned', type: TagType.ingredient },
            { name: 'kosher', type: TagType.ingredient },
        ].map(t => prisma.defaultTag.create({ data: t }))
    );

    /* ─────────── User tags ─────────── */
    const [
        jewishTag,
        freezableTag,
        freezable2Tag,
        makeAheadTag,
        veryDairyTag,
        amberApprovedTag,
        expensiveTag,
        getAtWFTag,
        betterFreshTag,
        betterCannedTag,
    ] = await Promise.all(
        [
            { name: 'Jewish', type: TagType.recipe, createdBy: adminUser.id },
            { name: 'trayfe', type: TagType.recipe, createdBy: adminUser.id },
            { name: 'freezable', type: TagType.recipe, createdBy: adminUser.id },
            { name: 'freezable', type: TagType.recipe, createdBy: regUser2.id },
            { name: 'make ahead', type: TagType.recipe, createdBy: regUser2.id },
            { name: 'very dairy', type: TagType.recipe, createdBy: regUser.id },
            { name: 'Amber approved', type: TagType.recipe, createdBy: regUser.id },
            { name: 'expensive', type: TagType.ingredient, createdBy: adminUser.id },
            { name: 'trayfe', type: TagType.ingredient, createdBy: adminUser.id },
            { name: 'get at WF', type: TagType.ingredient, createdBy: regUser.id },
            { name: 'better fresh', type: TagType.ingredient, createdBy: regUser2.id },
            { name: 'better canned', type: TagType.ingredient, createdBy: regUser2.id },
        ].map(t => prisma.userTag.create({ data: t }))
    );

    /* ─────────── Ingredients ─────────── */
    const beef = await prisma.ingredient.create({
        data: {
            name: 'ground beef 90/10',
            main: 'beef',
            variety: 'ground, 90/10',
            category: 'meat',
            subcategory: 'beef',
            userId: adminUser.id,

            defaultTags: {
                create: [{ tag: { connect: { id: meatTag.id } } }],
            },
            userTags: {
                create: [{ tag: { connect: { id: getAtWFTag.id } } }],
            },
        },
    });

    const beerMustard = await prisma.ingredient.create({
        data: {
            name: 'beer mustard',
            main: 'mustard',
            variety: 'beer',
            category: 'condiments',
            subcategory: 'mustard',
            userId: adminUser.id,
            brand: 'Kosciusko',
        }
    });

    /* remaining ingredients */
    await Promise.all([
        prisma.ingredient.create({
            data: {
                name: 'white onion',
                main: 'onion',
                variety: 'white',
                category: 'vegetable',
                subcategory: 'root',
                userId: adminUser.id,
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'large egg',
                main: 'egg',
                variety: 'large',
                userId: adminUser.id,
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'sage',
                category: 'herb',
                userId: adminUser.id,
                defaultTags: {
                    create: [{ tag: { connect: { id: driedTag.id } } }],
                },
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'carrot',
                main: 'carrot',
                category: 'vegetable',
                subcategory: 'root',
                userId: adminUser.id,
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'tomato',
                variety: 'beefsteak',
                userId: adminUser.id,
                seasons: {
                    connect: [{ id: spring.id }, { id: summer.id }],
                },
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'milk',
                variety: 'whole',
                category: 'dairy',
                userId: adminUser.id,
                defaultTags: {
                    create: [{ tag: { connect: { id: notVeganTag.id } } }],
                },
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'carrot',
                main: 'carrot',
                category: 'vegetable',
                subcategory: 'root',
                userId: regUser.id,
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'milk',
                variety: 'whole',
                category: 'dairy',
                userId: regUser.id,
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'carrot',
                main: 'carrot',
                category: 'vegetable',
                subcategory: 'root',
                userId: regUser2.id,
                defaultTags: {
                    create: [{ tag: { connect: { id: veganTag.id } } }],
                },
            },
        }),
        prisma.ingredient.create({
            data: {
                name: 'milk',
                variety: 'whole',
                category: 'dairy',
                userId: regUser2.id,
            },
        }),
    ]);

    /* ─────────── Recipes ─────────── */
    const meatloaf1 = await prisma.recipe.create({
        data: {
            name: 'meatloaf',
            userId: adminUser.id,
            ingredients: {
                create: [
                    {
                        ingredient: { connect: { id: beef.id } },
                        quantity: '1',
                        unit: 'lb',
                    },
                ],
            },
            defaultTags: {
                create: [{ tag: { connect: { id: quickRecipeTag.id } } }],
            },
        },
    });

    /* attach user recipe tag */
    await prisma.recipeUserTag.create({
        data: {
            recipeId: meatloaf1.id,
            tagId: freezableTag.id,
        },
    });

    /* second recipe */
    await prisma.recipe.create({
        data: {
            name: 'meatloaf',
            userId: regUser.id,
            defaultTags: {
                create: [
                    { tag: { connect: { id: quickRecipeTag.id } } },
                    { tag: { connect: { id: spicyRecipeTag.id } } },
                ],
            },
        },
    });


    console.log('Seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
