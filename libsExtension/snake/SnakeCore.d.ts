declare module snake {
    class ValMap {
        private m_List;
        private m_Map;
        constructor();
        /** 更新key=val */
        setVal(key: any, val: any): void;
        add(key: any, val: any): any;
        remove(key: any): boolean;
        contains(key: any): boolean;
        find(key: any): any;
        clear(): void;
        size(): number;
        list(): Array<any>;
    }
}
declare module snake {
    class DefaultFilter {
        constructor();
        operator(item: any): boolean;
    }
    class FixedSpatialItemContainer {
        protected m_Min: Vector2;
        protected m_Max: Vector2;
        protected m_Width: number;
        protected m_Height: number;
        protected m_Count: number;
        protected m_Bucket: Array<Array<any>>;
        protected m_CacheResult: Array<any>;
        protected GetBucketVec(p: Vector2): Array<any>;
        protected GetBucket(x: number, y: number): Array<any>;
        protected GetBucketIndex(p: Vector2, to: Vector2): void;
        Initialize(min: Vector2, max: Vector2, w: number, h: number): void;
        Add(v: any): any;
        Remove(v: any): void;
        FindInRange(p: Vector2, r: number, dir: Vector2, degree: number): Array<any>;
        FindInRangeFilter(min: Vector2, max: Vector2, filter: DefaultFilter): any[];
        ExtractInRange(min: Vector2, max: Vector2, outList: Array<any>): void;
        Clear(): void;
        Count(): number;
        Buckets(): Array<Array<any>>;
    }
}
declare module snake {
    class SceneManager {
        private m_Scenes;
        private m_SceneIDCounter;
        constructor();
        CreateScene(params: SceneParams): number;
        DeleteScene(sceneID: number): void;
        GetScene(sceneID: number): Scene;
        GetAICount(): number;
        GetPlayerCount(): number;
        GetBeanCount(): number;
    }
}
declare module snake {
    class SlitherBase {
        protected m_LastScoreLostTime: number;
        protected m_LastPhysicsTime: number;
        protected m_ScoreFactor: number;
        protected m_PointsDirty: boolean;
        protected m_EndPointIndex: number;
        protected m_Direction: Vector2;
        protected m_TargetDirection: Vector2;
        protected m_AABB: AABB;
        protected m_Points: Array<Vector2>;
        protected m_pScene: Scene;
        protected m_HeadInfoDirty: boolean;
        protected m_StateInfoDirty: boolean;
        protected m_BodyInfoDirty: boolean;
        protected m_SlitherInfo: SlitherInfo;
        protected m_BodyInfo: Array<any>;
        constructor();
        protected CalculatePointCount(): number;
        protected SegmentLength(): number;
        protected UpdateBodyPointsFrame(): void;
        protected UpdateDevourBean(params: SceneParams, speedDir: Vector2): void;
        protected UpdateBounds(): void;
        protected UpdateEndPointIndex(): void;
        protected OverlapBorder(): boolean;
        protected OverlapAnyOtherSlither(cc: CollisionContext): Slither;
        protected OverlapSlither(center: Vector2, width: number, other: Slither): boolean;
        protected UpdateSpeed(dt: number, linearSpeed: number, speedDir: Vector2, params: SceneParams): Vector2;
        Initialize(scene: Scene, id: number, skinID: number, score: number, headPos: Vector2, dir: Vector2): void;
        Update(time: number, dt: number): void;
        DrawGizmo(buffer: any, offset: number, maxSize: number): number;
        UpdateCollision(cc: CollisionContext): void;
        AddScore(score: number): void;
        SubScore(score: number): boolean;
        EndPointIndex(): number;
        SetSlitherCmd(targetDir: Vector2, accelarating: boolean): void;
        PointData(): Vector2;
        Points(): Array<Vector2>;
        PointCount(): number;
        Position(): Vector2;
        Direction(): Vector2;
        Accelarating(): boolean;
        Width(): number;
        Score(): number;
        Rank(): number;
        setRank(rank: number): void;
        Speed(): Vector2;
        ID(): number;
        SkinID(): number;
        Bounds(): AABB;
        Info(): SlitherInfo;
    }
}
declare module snake {
    let FOLLOW_FACTOR: number;
    let BEAN_MIN_DISTFACTOR: number;
    let AI_VIEW_ASPECT: number;
    let AVOID_ITERATION: number;
    let BEAN_POS_REACH_DIST2: number;
    let CIRCLING_DIST2: number;
    let CIRCLING_TIME: number;
    enum Strategy {
        Attacking = 0,
        Eatting = 1,
        Desperated = 2,
    }
    class Slither extends SlitherBase {
        private m_LastThinkTime;
        private m_LastWanderTime;
        private m_LastAccelarateTime;
        private m_ThinkInterval;
        private m_WanderInterval;
        private m_AccelarateInterval;
        private m_CirclingCheckTime;
        private m_CirclingChecking;
        private m_LastAttackTarget;
        private m_Strategy;
        private m_CornerPos;
        private m_SmoothTargetDirection;
        private m_MostThreateningPos;
        private m_AHeadPos;
        private m_FollowPos;
        private m_LastBeanPos;
        private m_CirclingCheckPosition;
        private m_AvoidRadiusRT;
        private m_Enable;
        private m_AIParams;
        private ExecuteStrategy(time, dir, accelarate);
        private CanChangeStrategy(time);
        private CirclingCheck(time, dist);
        private Avoidance(time, bestDir);
        private Wander(time, dir);
        private Follow(pos, dir);
        private SmoothSteering(dir);
        private DoAccelarate(time, accelarate);
        private FindBeanTarget(target, fromSlitherOnly);
        private FindAttackTarget(target);
        private FindMostThreateningPos(dir, mostThreateningPos);
        private WayIntersects(pos, radius, ahead, otherPos, otherRaidus);
        private FindSlitherPoint(other, avoidRadius, ahead, mostThreateningPos, mostThreateningDist);
        private CanAccelarte();
        private CanKill();
        constructor();
        Update(time: number, deltaTime: number): void;
        EnableAI(enable: any): void;
        IsEnableAI(): boolean;
        SetAIParams(params: AIParams): void;
        GetAIParams(): AIParams;
    }
}
declare module snake {
    let MAX_AI_ID: number;
    let SPATIAL_NUM: number;
    let ID_BUCKET_NUM: number;
    let VIEW_ASPECT: number;
    function IsAI(x: any): boolean;
    class SortSlitherInfo {
        static operator(lhs: SlitherInfo, rhs: SlitherInfo): number;
    }
    class CollisionContext {
        dieMap: Object;
        add(key: any, value: any): void;
        find(key: any): any;
    }
    class Scene {
        private m_Params;
        private m_PlayerTable;
        private m_AITable;
        private m_BeanTable;
        private m_ViewTable;
        private m_LastTime;
        private m_LastCompensateTime;
        private m_AIIDCounter;
        private m_ViewIDCounter;
        private m_Center;
        private m_HistorySlitherInfo;
        private m_BeanIDQueue;
        private m_ScoreWidth;
        private m_ScoreLength;
        private m_WidthView;
        private m_WidthRotationNormal;
        private m_WidthRotationFast;
        private m_AllSlithers;
        private m_CacheSlithersForQuery;
        private m_CacheKillBean;
        private m_CacheBeansForQuery;
        private m_CacheBeanDevoured;
        private m_CacheSlitherInfoForQuery;
        constructor();
        private WriteBufferByte(buff, offset, value);
        private WriteBufferSlitherHeadInfo(buff, offset, slither);
        private WriteBufferBirthDeathInfo(buff, offset, headInfo);
        private WriteBufferSlitherBodyInfo(bytes, offset, maxSize, slither);
        private AcquireBeanID();
        private ReleaseBeanID(id);
        FindSlither(id: number): Slither;
        ScroreToWidth(score: number): number;
        ScoreToLength(score: number): number;
        WidthToView(width: number): number;
        WidthToRotateNormal(width: number): number;
        WidthToRotateFast(width: number): number;
        Beans(): FixedSpatialItemContainer;
        AllSlithers(): Array<Slither>;
        Params(): SceneParams;
        Center(): Vector2;
        GetHistorySlitherInfo(playerID: number): SlitherInfo;
        AllSlitherInfoByRank(): Array<SlitherInfo>;
        IsPlayerAlive(playerID: number): boolean;
        GetAllSlitherCount(): number;
        ConfineInRange(pos: Vector2, center: Vector2, r: number): Vector2;
        IsPositionFit(pos: Vector2, emptySpace: number, slithers: Array<Slither>): boolean;
        RemoveSlither(slithers: Array<Slither>, id: number): void;
        ContainsSlitherID(slithers: Array<Slither>, id: number): boolean;
        ClampInBorder(pos: Vector2, center: Vector2, radius: number): Vector2;
        Initialize(params: SceneParams): void;
        AdjustInitialBeans(): void;
        ResetBeanIDQueue(): void;
        AdjustSceneParams(params: SceneAdjustableParams): void;
        ValueToValue(v: Array<Vector2>, count: number, value: number): number;
        UpdateScene(time: number): void;
        UpdateMove(time: number): void;
        UpdateCollision(cc: CollisionContext): void;
        UpdateHistorySlitherInfo(cc: CollisionContext): void;
        CompensateBeans(time: number): void;
        NotifyBeanDevoured(): void;
        UpdateCacheSlitherInfoForQuery(): void;
        UpdateKillBeanDevour(): void;
        UpdateView(): void;
        CreateSlitherAI(initialScore: number, skinID: number, aiParams: AIParams, pos: Vector2, dir: Vector2): number;
        CreateSlitherPlayer(playerID: number, initialScore: number, skinID: number, pos: Vector2, dir: Vector2): boolean;
        SetSlitherAI(playerID: number, params: AIParams): void;
        SetSlitherPlayerCmd(playerID: number, targetDir: Vector2, accelarating: boolean): void;
        FindBestFitPosition(emptySize: number, maxTryCount: number, outsideFirst: boolean, optimalPos: Vector2, outPos: Vector2): boolean;
        DevourBean(bean: Bean, slitherID: number, kill: boolean): void;
        GenerateBean(pos: Vector2, valVisual: number, valReal: number): void;
        GenerateBeanOnSlitherDie(pSlither: SlitherBase, pKiller: Slither): void;
        DeleteAllBeans(): void;
        DeleteAllSlithers(): void;
        GetBeanCount(): number;
        GetAICount(): number;
        GetPlayerCount(): number;
        QueryRankSyncData(count: number, bytes: any, maxSize: number): number;
        QueryMiniMapSyncData(count: number, bytes: any, maxSize: number): number;
        CreateView(playerID: number): number;
        DeleteView(viewID: number): void;
        FindSlithersInView(view: AABB): Array<Slither>;
        BuildBirthDeath(birthDeath: Array<BirthDeathInfo>, bytes: any, maxSize: number): number;
        BuildHeadSyncData(slithers: Array<Slither>, bytes: any, maxSize: number): number;
        BuildInfoSyncData(player: SlitherInfo, bytes: any, maxSize: number): number;
        BuildBodySyncData(slithers: Array<Slither>, bytes: any, maxSize: number): number;
        BuildBeanSpawnSyncData(beans: Array<Bean>, bytes: any, maxSize: number): number;
        BuildBeanDevouredSyncData(beans: Array<BeanDevoured>, kill: boolean, bytes: any, maxSize: number): number;
        QueryPlayerBirthDeath(viewID: number, bytes: any, maxSize: number): number;
        QueryPlayerHeadSyncData(viewID: number, bytes: any, maxSize: number): number;
        QueryPlayerInfoSyncData(viewID: number, bytes: any, maxSize: number): number;
        QueryPlayerBodySyncData(viewID: number, bytes: any, maxSize: number): number;
        QueryPlayerBeanSpawnData(viewID: number, bytes: any, maxSize: number): number;
        QueryPlayerBeanDevouredData(viewID: number, kill: boolean, bytes: any, maxSize: number): number;
        QueryPlayerBeanRefreshData(viewID: number, bytes: any, maxSize: number): number;
    }
}
declare module snake {
    class Bean {
        id: number;
        position: Vector2;
        valReal: number;
        valVisual: number;
        fromSlither: boolean;
        slitherID: number;
    }
    class BeanDevoured {
        id: number;
        position: Vector2;
        slitherID: number;
        kill: boolean;
    }
}
declare module snake {
    let _PI: number;
    let deg2rad: number;
    let rad2deg: number;
    function min(x: any, y: any): any;
    function max(x: any, y: any): any;
    function clamp(value: any, low: any, high: any): any;
    function lerp(a: any, b: any, t: any): number;
    function saturate(t: any): any;
    function uniform_random(min: number, max: number): number;
    function gaussian_random(sigma?: number): number;
}
declare module snake {
    class unordered_map {
        v: Object;
        add(key: any, value: any): void;
    }
    class unordered_set {
        v: Object;
        add(key: any, value: any): void;
    }
}
declare module snake {
    function CreateScene(params: SceneParams): number;
    function SnakeAdjustSceneParams(sceneID: number, params: SceneAdjustableParams): void;
    function UpdateScene(sceneID: number, time: number): void;
    function DeleteScene(sceneID: number): void;
    function DeleteAllBeans(sceneID: number): void;
    function DeleteAllSlithers(sceneID: number): void;
    function CreateSlitherAI(sceneID: number, initialScore: number, skinID: number, aiParams: AIParams, pos: Vector2, dir: Vector2): number;
    function CreateSlitherPlayer(sceneID: number, playerID: number, initialScore: number, skinID: number, pos: Vector2, dir: Vector2): boolean;
    function SetSlitherAI(sceneID: number, playerID: number, aiParams: AIParams): void;
    function SetSlitherPlayerCmd(sceneID: number, playerID: number, targetDir: Vector2, accelarating: boolean): void;
    function FindBestFitPosition(sceneID: number, emptySize: number, maxTryCount: number, outsideFirst: boolean, optimalPos: Vector2, outPos: Vector2): boolean;
    function GetSlitherInfo(sceneID: number, playerID: number): SlitherInfo;
    function SnakeGenerateBean(sceneID: number, pos: Vector2, valVisual: number, valReal: number): void;
    function IsPlayerAlive(sceneID: number, playerID: number): boolean;
    function GetBeanCount(sceneID: number): number;
    function GetAICount(sceneID: number): number;
    function GetPlayerCount(sceneID: number): number;
    function QueryRankSyncData(sceneID: number, count: number, buffer: any, maxSize: number): number;
    function QueryMiniMapSyncData(sceneID: number, count: number, buffer: any, maxSize: number): number;
    function CreateView(sceneID: number, playerID: number): number;
    function DeleteView(sceneID: number, viewID: number): void;
    function QueryPlayerBirthDeath(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerHeadSyncData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerInfoSyncData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerBodySyncData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerBodySyncBaseData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerBodySyncFactorData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerBeanSpawnData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
    function QueryPlayerBeanDevouredData(sceneID: number, viewID: number, kill: boolean, buffer: any, maxSize: number): number;
    function QueryPlayerBeanRefreshData(sceneID: number, viewID: number, buffer: any, maxSize: number): number;
}
declare module snake {
    class SceneParams {
        radius: number;
        physicsTimeStep: number;
        frameStep: number;
        collisionThreshold: number;
        initialBeanSigma: number;
        initialBeanMin: number;
        initialBeanMax: number;
        initialBeanCount: number;
        scoreWidthCount: number;
        scoreLengthCount: number;
        widthViewCount: number;
        widthRotateNormalCount: number;
        widthRotateFastCount: number;
        scoreWidth: Array<Vector2>;
        scoreLength: Array<Vector2>;
        widthView: Array<Vector2>;
        widthRotateNormal: Array<Vector2>;
        widthRotateFast: Array<Vector2>;
        linearSpeedNormal: number;
        linearSpeedFast: number;
        linearAccelartion: number;
        linearDeccelartion: number;
        devourBase: number;
        devourScale: number;
        devourDegree: number;
        headTestStart: number;
        headTestEndFactor: number;
        baseScore: number;
        scoreScale: number;
        scoreVisualScale: number;
        dieScoreBase: number;
        dieScorePercent: number;
        dieScoreCountRatio: number;
        dieScoreVisualScale: number;
        dieScoreRandOffset: number;
        accelarateScoreLost: number;
        accelarateScoreInterval: number;
        accelarateScoreRatio: number;
        killBeanCount: number;
        killBeanMaxPoint: number;
        killBeanScoreRatio: number;
        compensateBeanCount: number;
        compensateBeanThreshold: number;
        compensateBeanDistance: number;
        compensateBeanRadius: number;
        compensateBeanInterval: number;
        aiAccelarateMinScore: number;
        aiKillMinScore: number;
        randSeed: number;
    }
    class SceneAdjustableParams {
        initialBeanCount: number;
        compensateBeanThreshold: number;
    }
    class AIParams {
        configID: number;
        aHeadDist: number;
        avoidRadius: number;
        agressive: number;
        agile: number;
        findBeanDist: number;
        desperateFactor: number;
        eatBeanFactor: number;
        minThinkInterval: number;
        maxThinkInterval: number;
        minWanderInterval: number;
        maxWanderInterval: number;
    }
    class SlitherInfo {
        id: number;
        rank: number;
        skinID: number;
        head: Vector2;
        speed: Vector2;
        score: number;
        width: number;
        length: number;
        inTeamNum: number;
        continueKillCount: number;
        totalKillCount: number;
        accelarating: boolean;
        lastKillerID: number;
    }
    enum BirthDeathType {
        EnterView = 1,
        ExitView = 2,
    }
    class BirthDeathInfo {
        type: number;
        id: number;
    }
}
declare module snake {
    class UIntSet {
        private m_Max;
        private m_Count;
        private m_Bucket;
        Initialize(max: number): void;
        GetBucket(v: number): Array<number>;
        Add(v: number): void;
        Remove(v: number): void;
        Contains(v: number): boolean;
        Clear(): void;
        Count(): number;
    }
}
declare module snake {
    let FLT_MIN: number;
    let FLT_MAX: number;
    class AABB {
        min: Vector2;
        max: Vector2;
        constructor();
        static createAABB(_min: Vector2, _max: Vector2): AABB;
        static createAB(a: AABB): AABB;
        equal(a: AABB): AABB;
        Clear(): void;
        IsValid(): boolean;
        Encapuslate(pt: Vector2): void;
        Contains(pt: Vector2): boolean;
        Extents(): Vector2;
        Center(): Vector2;
        Size(): Vector2;
        Enlarge(extent: number): any;
        Enlarge(extent: Vector2): any;
        Intersect(aabb: AABB): boolean;
        IntersectVec(pt: Vector2, r: number): boolean;
    }
}
declare module snake {
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        SetVec(a: Vector2): void;
        vec: Vector2;
        SetTo(x: number, y: number): void;
        equal(a: Vector2): boolean;
        noequal(a: Vector2): boolean;
        add(rhs: Vector2): Vector2;
        add(rhs: number): Vector2;
        sub(rhs: Vector2): Vector2;
        sub(rhs: number): Vector2;
        mul(rhs: Vector2): Vector2;
        mul(rhs: number): Vector2;
        div(rhs: Vector2): Vector2;
        div(rhs: number): Vector2;
        /** this+=rhs */
        addAssignment(rhs: Vector2): Vector2;
        addAssignment(rhs: number): Vector2;
        /** this-=rhs */
        subAssignment(rhs: Vector2): Vector2;
        subAssignment(rhs: number): Vector2;
        /** this*=rhs */
        mulAssignment(rhs: Vector2): Vector2;
        mulAssignment(rhs: number): Vector2;
        /** this/=rhs */
        divAssignment(rhs: Vector2): Vector2;
        divAssignment(rhs: number): Vector2;
        Magnitude(): number;
        SquareMagnitude(): number;
        IsZero(): boolean;
        IsValid(): boolean;
    }
    function Dot(lhs: Vector2, rhs: Vector2): number;
    function operatorMul(k: number, rhs: Vector2): Vector2;
    function Normalize(v: Vector2): Vector2;
    function Reflect(v: Vector2, n: Vector2): Vector2;
    function Right(v: Vector2): Vector2;
    function Distance(a: Vector2, b: Vector2): number;
    function Slerp(vectorA: Vector2, vectorB: Vector2, t: number): Vector2;
    function RotateTowards(rotateFrom: Vector2, rotateTo: Vector2, maxDeltaTheta: number): Vector2;
    function random_on_unitcircle(): Vector2;
    function random_in_unitcircle(): Vector2;
    function random_gaussian_disk(sigma?: number): Vector2;
}
declare module snake {
    class View {
        private m_BeanQueriedTable;
        private m_BeanDevouredList;
        private m_KillBeanDevouredList;
        private m_SlithersInView;
        private m_pScene;
        private m_ViewID;
        private m_SlitherID;
        private m_AABB;
        constructor();
        Initialize(pScene: Scene, viewID: number, slitherID: number): void;
        Update(): void;
        GetSlitherInfo(): SlitherInfo;
        ResetBeanHistory(): void;
        FilterBean(bean: Bean): boolean;
        NotifyBeanDevoured(beanDevoured: Array<BeanDevoured>): void;
        Bounds(): AABB;
        DevouredBeans(): Array<BeanDevoured>;
        DevouredKillBeans(): Array<BeanDevoured>;
        SlithersInView(): Array<number>;
    }
    class ViewBeanFilter extends DefaultFilter {
        private view;
        constructor(v: View);
        operator(bean: Bean): boolean;
    }
}
