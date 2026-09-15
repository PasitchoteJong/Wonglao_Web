const [roulette, setRoulette] = useState(null);
const [isOwner, setIsOwner] = useState(false);

const [isSpinning, setIsSpinning] =
    useState(false);

const [winner, setWinner] =
    useState(null);

const [showResult, setShowResult] =
    useState(false);


useEffect(() => {

    const loadRoulette = async () => {

        const data =
            await getRoulette(billId);

        setRoulette(data.roulette);
        setIsOwner(data.isOwner);
    };

    loadRoulette();

}, [billId]);