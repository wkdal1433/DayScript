import { PrismaClient, ProblemType, ProblemDifficulty, ProgrammingLanguage } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // ============================================================================
    // 1. 테스트 사용자 생성
    // ============================================================================
    console.log('\n👤 Creating test users...');

    const hashedPassword = await bcrypt.hash('test1234', 10);

    const testUser = await prisma.user.upsert({
        where: { email: 'test@dayscript.com' },
        update: {},
        create: {
            email: 'test@dayscript.com',
            username: 'testuser',
            passwordHash: hashedPassword,
            displayName: '테스트 유저',
            currentLevel: 1,
            totalExperience: 0,
            isActive: true,
            isVerified: true,
            settings: {
                create: {
                    dailyGoalMinutes: 30,
                    preferredLanguage: 'Python',
                    difficultyLevel: 1,
                }
            },
            progress: {
                create: {
                    unlockedLevels: [1],
                    completedLevels: [],
                    currentLevel: 1,
                }
            }
        },
    });

    console.log(`✅ Created user: ${testUser.username}`);

    // ============================================================================
    // 2. LV1 OX 문제 생성 (5개)
    // ============================================================================
    console.log('\n📝 Creating LV1 OX problems...');

    const lv1Problems = [
        {
            level: 1,
            type: ProblemType.OX,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Python,
            title: 'Python은 인터프리터 언어이다',
            description: 'Python 언어의 기본 특성에 대한 문제입니다.',
            question: 'Python은 컴파일 과정 없이 바로 실행되는 인터프리터 언어입니다.',
            correctAnswer: { answer: 'O' },
            hint1: 'Python 파일(.py)을 실행할 때 별도의 컴파일 과정이 필요한가요?',
            hint2: 'C나 Java와 달리 Python은 소스 코드를 직접 실행합니다.',
            tags: ['Python', '기본개념', '인터프리터'],
            category: '프로그래밍 기초',
            isPublished: true,
        },
        {
            level: 1,
            type: ProblemType.OX,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Python,
            title: 'Python에서 변수 선언 시 타입을 명시해야 한다',
            description: 'Python의 변수 선언 방식에 대한 문제입니다.',
            question: 'Python에서 변수를 선언할 때는 반드시 데이터 타입을 명시해야 합니다.',
            correctAnswer: { answer: 'X' },
            hint1: 'Python은 동적 타입 언어입니다.',
            hint2: 'x = 10 처럼 타입 없이 바로 값을 할당할 수 있습니다.',
            tags: ['Python', '변수', '동적타입'],
            category: '프로그래밍 기초',
            isPublished: true,
        },
        {
            level: 1,
            type: ProblemType.OX,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.JavaScript,
            title: 'JavaScript에서 let과 var는 완전히 동일하다',
            description: 'JavaScript의 변수 선언 키워드에 대한 문제입니다.',
            question: 'JavaScript에서 let과 var는 스코프와 호이스팅 동작이 완전히 동일합니다.',
            correctAnswer: { answer: 'X' },
            hint1: 'let은 블록 스코프, var는 함수 스코프를 가집니다.',
            hint2: '호이스팅 시 동작 방식이 다릅니다.',
            tags: ['JavaScript', '변수', 'let', 'var'],
            category: '프로그래밍 기초',
            isPublished: true,
        },
        {
            level: 1,
            type: ProblemType.OX,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Python,
            title: 'Python 리스트는 서로 다른 타입의 데이터를 담을 수 있다',
            description: 'Python 리스트의 특성에 대한 문제입니다.',
            question: 'Python의 리스트는 정수, 문자열, 불린 등 서로 다른 타입의 데이터를 하나의 리스트에 담을 수 있습니다.',
            correctAnswer: { answer: 'O' },
            hint1: 'Python은 동적 타입 언어입니다.',
            hint2: '[1, "hello", True] 같은 리스트가 가능합니다.',
            tags: ['Python', '리스트', '자료구조'],
            category: '자료구조',
            isPublished: true,
        },
        {
            level: 1,
            type: ProblemType.OX,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Java,
            title: 'Java에서 문자열은 원시 타입이다',
            description: 'Java의 데이터 타입에 대한 문제입니다.',
            question: 'Java에서 String(문자열)은 int, char처럼 원시 타입(primitive type)입니다.',
            correctAnswer: { answer: 'X' },
            hint1: 'String은 클래스입니다.',
            hint2: '원시 타입은 int, char, boolean 등입니다.',
            tags: ['Java', '자료형', 'String'],
            category: '프로그래밍 기초',
            isPublished: true,
        },
    ];

    for (const problem of lv1Problems) {
        const created = await prisma.quizProblem.create({ data: problem });
        console.log(`  ✅ LV1: ${created.title}`);
    }

    // ============================================================================
    // 3. LV2 객관식 문제 생성 (5개)
    // ============================================================================
    console.log('\n📝 Creating LV2 Multiple Choice problems...');

    const lv2Problems = [
        {
            level: 2,
            type: ProblemType.MULTIPLE_CHOICE,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Python,
            title: 'Python에서 리스트의 마지막 요소를 가져오는 방법',
            description: 'Python 리스트 인덱싱에 대한 문제입니다.',
            question: 'arr = [1, 2, 3, 4, 5] 일 때, 마지막 요소 5를 가져오는 올바른 방법은?',
            options: {
                choices: ['arr[4]', 'arr[-1]', 'arr[len(arr)]', 'arr.last()'],
            },
            correctAnswer: { answer: 1, explanation: 'Python에서 -1 인덱스는 마지막 요소를 가리킵니다. arr[4]도 가능하지만 -1이 더 범용적입니다.' },
            hint1: '음수 인덱스를 사용할 수 있습니다.',
            hint2: '-1은 마지막 요소를 의미합니다.',
            tags: ['Python', '리스트', '인덱싱'],
            category: '자료구조',
            isPublished: true,
        },
        {
            level: 2,
            type: ProblemType.MULTIPLE_CHOICE,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.JavaScript,
            title: 'JavaScript 배열 메서드의 반환값',
            description: 'JavaScript 배열 메서드에 대한 문제입니다.',
            question: '[1, 2, 3, 4, 5].filter(x => x > 3) 의 결과는?',
            options: {
                choices: ['[4, 5]', '[3, 4, 5]', '[1, 2, 3]', 'true'],
            },
            correctAnswer: { answer: 0, explanation: 'filter()는 조건을 만족하는 요소들로 새 배열을 만듭니다. x > 3을 만족하는 것은 4와 5입니다.' },
            hint1: 'filter()는 조건을 만족하는 요소만 모아 새 배열을 만듭니다.',
            hint2: '3보다 큰 수는 4와 5입니다.',
            tags: ['JavaScript', '배열', 'filter'],
            category: '배열 메서드',
            isPublished: true,
        },
        {
            level: 2,
            type: ProblemType.MULTIPLE_CHOICE,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.Python,
            title: 'Python 딕셔너리 접근 방법',
            description: 'Python 딕셔너리 사용법에 대한 문제입니다.',
            question: 'd = {"name": "John", "age": 25} 일 때, 키가 없어도 에러가 발생하지 않는 방법은?',
            options: {
                choices: ['d["name"]', 'd.name', 'd.get("name")', 'd.find("name")'],
            },
            correctAnswer: { answer: 2, explanation: 'get() 메서드는 키가 없으면 None을 반환하여 KeyError를 방지합니다.' },
            hint1: 'get() 메서드를 사용하면 안전합니다.',
            hint2: 'get()은 키가 없으면 None을 반환합니다.',
            tags: ['Python', '딕셔너리', 'get'],
            category: '자료구조',
            isPublished: true,
        },
        {
            level: 2,
            type: ProblemType.MULTIPLE_CHOICE,
            difficulty: ProblemDifficulty.easy,
            language: ProgrammingLanguage.Java,
            title: 'Java 반복문의 출력',
            description: 'Java 반복문 이해도 문제입니다.',
            question: 'for(int i = 0; i < 3; i++) { System.out.print(i); } 의 출력은?',
            options: {
                choices: ['012', '123', '0123', '에러 발생'],
            },
            correctAnswer: { answer: 0, explanation: 'i는 0부터 시작하고 3 미만까지 실행되므로 0, 1, 2가 출력됩니다.' },
            hint1: 'i는 0부터 시작합니다.',
            hint2: 'i < 3 조건이므로 0, 1, 2까지만 실행됩니다.',
            tags: ['Java', '반복문', 'for'],
            category: '제어문',
            isPublished: true,
        },
        {
            level: 2,
            type: ProblemType.MULTIPLE_CHOICE,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.Python,
            title: 'Python 함수의 기본 매개변수',
            description: 'Python 함수 매개변수에 대한 문제입니다.',
            question: 'def greet(name="Guest"): return f"Hello, {name}"\ngreet()의 결과는?',
            options: {
                choices: ['"Hello, "', '"Hello, Guest"', 'None', '에러 발생'],
            },
            correctAnswer: { answer: 1, explanation: '기본 매개변수가 "Guest"로 설정되어 있어 인자 없이 호출 시 "Hello, Guest"가 반환됩니다.' },
            hint1: '기본 매개변수가 설정되어 있습니다.',
            hint2: '인자를 전달하지 않으면 기본값이 사용됩니다.',
            tags: ['Python', '함수', '기본매개변수'],
            category: '함수',
            isPublished: true,
        },
    ];

    for (const problem of lv2Problems) {
        const created = await prisma.quizProblem.create({ data: problem });
        console.log(`  ✅ LV2: ${created.title}`);
    }

    // ============================================================================
    // 4. LV3 빈칸 채우기 문제 생성 (3개)
    // ============================================================================
    console.log('\n📝 Creating LV3 Fill in the Blank problems...');

    const lv3Problems = [
        {
            level: 3,
            type: ProblemType.FILL_IN_BLANK,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.Python,
            title: 'Python 리스트 컴프리헨션',
            description: 'Python 리스트 컴프리헨션을 완성하는 문제입니다.',
            question: '0부터 9까지의 숫자 중 짝수만 포함하는 리스트를 만드세요.',
            codeSnippet: 'even_numbers = [x for x in range(10) if x ___ 2 == 0]',
            correctAnswer: {
                answer: '%',
                alternatives: ['mod', 'modulo'],
                explanation: '% 연산자는 나머지를 계산합니다. x % 2 == 0이면 짝수입니다.'
            },
            hint1: '나머지 연산자를 사용하세요.',
            hint2: '% 연산자로 2로 나눈 나머지를 확인합니다.',
            tags: ['Python', '리스트컴프리헨션', '연산자'],
            category: '자료구조',
            isPublished: true,
        },
        {
            level: 3,
            type: ProblemType.FILL_IN_BLANK,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.JavaScript,
            title: 'JavaScript 화살표 함수',
            description: 'JavaScript 화살표 함수를 완성하는 문제입니다.',
            question: '배열의 각 요소를 2배로 만드는 함수를 완성하세요.',
            codeSnippet: 'const double = arr => arr.___(x => x * 2);',
            correctAnswer: {
                answer: 'map',
                explanation: 'map() 메서드는 배열의 각 요소에 함수를 적용하여 새 배열을 반환합니다.'
            },
            hint1: '배열의 각 요소를 변환하는 메서드입니다.',
            hint2: 'map() 메서드를 사용합니다.',
            tags: ['JavaScript', '화살표함수', 'map'],
            category: '배열 메서드',
            isPublished: true,
        },
        {
            level: 3,
            type: ProblemType.FILL_IN_BLANK,
            difficulty: ProblemDifficulty.medium,
            language: ProgrammingLanguage.Python,
            title: 'Python 딕셔너리 메서드',
            description: 'Python 딕셔너리에서 모든 키를 가져오는 문제입니다.',
            question: '딕셔너리의 모든 키를 리스트로 변환하세요.',
            codeSnippet: 'd = {"a": 1, "b": 2}\nkeys = list(d.___())',
            correctAnswer: {
                answer: 'keys',
                explanation: 'keys() 메서드는 딕셔너리의 모든 키를 반환합니다.'
            },
            hint1: '딕셔너리의 키를 가져오는 메서드입니다.',
            hint2: 'keys() 메서드를 사용합니다.',
            tags: ['Python', '딕셔너리', 'keys'],
            category: '자료구조',
            isPublished: true,
        },
    ];

    for (const problem of lv3Problems) {
        const created = await prisma.quizProblem.create({ data: problem });
        console.log(`  ✅ LV3: ${created.title}`);
    }

    // ============================================================================
    // 5. 사용자 레벨 통계 초기화
    // ============================================================================
    console.log('\n📊 Creating user level statistics...');

    for (let level = 1; level <= 6; level++) {
        await prisma.userLevelStatistics.create({
            data: {
                userId: testUser.id,
                level: level,
                accuracy: 0,
                problemsAttempted: 0,
                problemsSolved: 0,
                averageTimeSeconds: 0,
            },
        });
        console.log(`  ✅ Level ${level} statistics created`);
    }

    console.log('\n✨ Seed completed successfully!\n');

    console.log('📋 Summary:');
    console.log(`  - Users: 1`);
    console.log(`  - LV1 Problems: ${lv1Problems.length}`);
    console.log(`  - LV2 Problems: ${lv2Problems.length}`);
    console.log(`  - LV3 Problems: ${lv3Problems.length}`);
    console.log(`  - Total Problems: ${lv1Problems.length + lv2Problems.length + lv3Problems.length}`);
    console.log(`  - Level Statistics: 6`);
    console.log('\n🎉 Database is ready for development!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
